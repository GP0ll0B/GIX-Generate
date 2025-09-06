import React, { useState, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { LightningBoltIcon, ServerIcon, DocumentSearchIcon } from "./ui/icons";
import { Button } from "./ui/Button";
import { Loader } from "./ui/Loader";

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-md border border-white/20 dark:border-white/10 p-6 mb-6">
    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center gap-2">
      {icon} {title}
    </h3>
    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-ul:list-disc prose-ul:list-inside prose-ol:list-decimal prose-ol:list-inside prose-code:text-xs prose-code:bg-gray-200/50 prose-code:dark:bg-gray-900/50 prose-code:p-1 prose-code:rounded-md prose-code:font-mono">
      {children}
    </div>
  </div>
);

const backendGuide = {
  python: `from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llama_cpp import Llama
import json
import time

app = FastAPI(title="SmolLM2-360M Streaming API")

# Allow all origins for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the GGUF model
# Adjust n_gpu_layers based on your setup. -1 tries to offload all layers to GPU.
llm = Llama(model_path="./SmolLM2-360M-Instruct-Q8_0.gguf", n_ctx=2048, n_gpu_layers=-1)

# Token streaming generator
def token_stream(prompt: str, max_tokens: int, temperature: float):
    start_time = time.time()
    output_token_count = 0

    # Tokenize input prompt to get input token count
    input_tokens = llm.tokenize(prompt.encode('utf-8'))
    input_token_count = len(input_tokens)

    # Stream tokens from llama.cpp
    for chunk in llm(prompt=prompt, max_tokens=max_tokens, temperature=temperature, stop=["<|user|>"], stream=True):
        token_text = chunk["choices"][0]["text"]
        output_token_count += 1
        elapsed = time.time() - start_time
        tokens_per_sec = output_token_count / elapsed if elapsed > 0 else 0
        total_tokens = input_token_count + output_token_count

        # Yield SSE message
        data = {
            "token": token_text,
            "input_token_count": input_token_count,
            "output_token_count": output_token_count,
            "total_tokens": total_tokens,
            "elapsed_time": elapsed,
            "tokens_per_second": tokens_per_sec,
            "done": False
        }
        yield f"data: {json.dumps(data)}\\n\\n"

    # Signal completion
    yield f"data: {json.dumps({'done': True})}\\n\\n"

# Streaming endpoint
@app.get("/generate-stream")
async def generate_stream(prompt: str, max_tokens: int = 256, temperature: float = 0.7):
    return StreamingResponse(
        token_stream(prompt, max_tokens, temperature),
        media_type="text/event-stream"
    )
`,
  react: `import React, { useState, useRef, useEffect } from "react";
// Other imports (Button, Loader, etc.) go here

export const LiveGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [performance, setPerformance] = useState({ tps: 0, count: 0 });
  const eventSourceRef = useRef<EventSource | null>(null);

  const stopStreaming = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setLoading(false);
  }

  const startStreaming = () => {
    if (!prompt) return;
    setLoading(true);
    setOutputText("");
    setPerformance({ tps: 0, count: 0 });

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    
    const url = \`http://localhost:8000/generate-stream?prompt=\${encodeURIComponent(prompt)}&max_tokens=256\`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    let buffer = "";
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.done) {
          stopStreaming();
        } else if (data.token) {
          buffer += data.token;
          setOutputText(buffer);
          setPerformance({ tps: data.tokens_per_second, count: data.token_count });
        }
      } catch (e) {
        console.error("Failed to parse stream data:", event.data);
      }
    };

    es.onerror = (err) => {
      console.error("EventSource connection error occurred.");
      // Handle error display for user
      stopStreaming();
    };
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    }
  }, []);

  return (
    <div>
      <textarea
        rows={5}
        placeholder="Enter your prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={startStreaming} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Live'}
      </button>
       {loading && <button onClick={stopStreaming}>Stop</button>}
      <div>
        <h3>Output:</h3>
        <pre>{outputText}</pre>
        <p>Tokens Generated: {performance.count}</p>
        <p>Tokens per Second: {performance.tps.toFixed(2)}</p>
      </div>
    </div>
  );
};`
};

export const AikoModelCard: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenSummary, setTokenSummary] = useState<{ token: string; count: number }[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    inputTokenCount: 0,
    outputTokenCount: 0,
    totalTokens: 0,
    generationTimeMs: 0,
    tokensPerSecond: 0,
  });
  const eventSourceRef = useRef<EventSource | null>(null);

  const inspectionScript = `#!/usr/bin/env bash
set -euo pipefail
if [ $# -lt 1 ]; then
  echo "Usage: $0 <SmolLM2-360M-Instruct-Q8_0.gguf>"
  exit 1
fi
MODEL_FILE="$1"
echo "Inspecting GGUF model: $MODEL_FILE"
strings "$MODEL_FILE" | grep -E "general\\\\.architecture|general\\\\.name|general\\\\.finetune|llama\\\\.context_length|llama\\\\.block_count" | sort -u
strings "$MODEL_FILE" | grep -E "Q8_0|quantization"
strings "$MODEL_FILE" | grep -E "<\\\\|system\\\\|>|<\\\\|user\\\\|>|<\\\\|assistant\\\\|>" | sort -u
strings "$MODEL_FILE" | grep -E "^<.*>$" | head -20
ls -lh "$MODEL_FILE"`;

  const analyzeTokens = (text: string) => {
    const regex = /<\|system\|>|<\|user\|>|<\|assistant\|>/g;
    const matches = text.match(regex) || [];
    const summary: Record<string, number> = {};
    matches.forEach((token) => (summary[token] = (summary[token] || 0) + 1));
    setTokenSummary(Object.entries(summary).map(([token, count]) => ({ token, count })));
  };

  const stopStreaming = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setLoading(false);
  };

  const startStreaming = () => {
    if (!prompt) return;
    setLoading(true);
    setResult("");
    setTokenSummary([]);
    setPerformanceMetrics({
      inputTokenCount: 0,
      outputTokenCount: 0,
      totalTokens: 0,
      generationTimeMs: 0,
      tokensPerSecond: 0,
    });
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    
    const url = `http://localhost:8000/generate-stream?prompt=${encodeURIComponent(prompt)}&max_tokens=256&temperature=0.7`;
    const es = new EventSource(url);
    eventSourceRef.current = es;
    let buffer = "";

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.done) {
          stopStreaming();
          return;
        }
        if (data.token) {
          buffer += data.token;
          setResult(buffer);
          analyzeTokens(buffer);
          setPerformanceMetrics({
            inputTokenCount: data.input_token_count,
            outputTokenCount: data.output_token_count,
            totalTokens: data.total_tokens,
            generationTimeMs: data.elapsed_time * 1000,
            tokensPerSecond: data.tokens_per_second,
          });
        }
      } catch (e) {
        console.error("Failed to parse stream data:", event.data, e);
      }
    };

    es.onerror = () => {
      console.error("EventSource connection error. Ensure the local model server is running and CORS is configured.");
      setResult(prev => prev + (prev ? '\n\n' : '') + `--- ERROR ---\nCould not connect to the local model server. Please ensure it's running on port 8000 and that you've configured CORS.`);
      stopStreaming();
    };
  };

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-fast">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Aiko360-Instruct Model Card
        </h2>
        <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
            An interactive demonstration of the self-hosted Aiko360-Instruct model.
        </p>
      </div>
      <Section title="Interactive Demo (Local Backend)" icon={<LightningBoltIcon />}>
        <textarea
          className="w-full p-2 border rounded mb-2 bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-white border-gray-300/50 dark:border-gray-600/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          rows={5}
          placeholder="Enter your prompt... e.g., 'Explain the concept of symbiosis between humans and AI.'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex items-center gap-3">
            <Button
              onClick={startStreaming}
              disabled={loading}
              className="w-full"
            >
              {loading ? <Loader text="Generating..." /> : "Generate Content"}
            </Button>
            {loading && (
                <Button onClick={stopStreaming} variant="secondary" className="!bg-red-500/10 hover:!bg-red-500/20 !text-red-700 dark:!text-red-300">
                    Stop
                </Button>
            )}
        </div>

        {result && (
            <div className="mt-4">
                <pre className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded text-sm whitespace-pre-wrap border border-gray-200/50 dark:border-gray-700/50">
                    {result}
                </pre>
                
                {(tokenSummary.length > 0 || performanceMetrics.outputTokenCount > 0) && (
                    <div className="mt-6 space-y-6">
                        <div>
                            <h4 className="font-bold mb-2">Performance Metrics (Live)</h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-100 dark:bg-gray-900/50 rounded border border-gray-200/50 dark:border-gray-700/50">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Input Tokens</p>
                                    <p className="text-xl font-mono font-semibold text-gray-800 dark:text-gray-200">{performanceMetrics.inputTokenCount}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Output Tokens</p>
                                    <p className="text-xl font-mono font-semibold text-gray-800 dark:text-gray-200">{performanceMetrics.outputTokenCount}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Tokens</p>
                                    <p className="text-xl font-mono font-semibold text-gray-800 dark:text-gray-200">{performanceMetrics.totalTokens}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time (ms)</p>
                                    <p className="text-xl font-mono font-semibold text-gray-800 dark:text-gray-200">{performanceMetrics.generationTimeMs.toFixed(0)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tokens/Sec</p>
                                    <p className="text-xl font-mono font-semibold text-gray-800 dark:text-gray-200">{performanceMetrics.tokensPerSecond.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {tokenSummary.length > 0 && (
                            <div>
                                <h4 className="font-bold mb-2">Token Frequency (Live)</h4>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={tokenSummary} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                                        <XAxis dataKey="token" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#4f46e5" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}
      </Section>

      <Section title="Model Inspection (GGUF)" icon={<DocumentSearchIcon />}>
        <p>
          You can inspect the GGUF file yourself using the following shell script. This helps verify metadata, quantization, and special tokens without running the model.
        </p>
        <pre><code>{inspectionScript}</code></pre>
        <h4>Why This Script is Relevant</h4>
        <p>This script uses common command-line tools to extract key information from the binary GGUF file:</p>
        <ul>
            <li><strong>Metadata Keys:</strong> Using <code>strings</code> combined with <code>grep</code>, it searches for known GGUF metadata fields like <code>general.architecture</code> and <code>llama.context_length</code> to reveal the model's configuration.</li>
            <li><strong>Quantization Check:</strong> It looks for the string <code>"Q8_0"</code>, which confirms the model's 8-bit quantization level—a crucial detail for performance and memory footprint.</li>
            <li><strong>Special Tokens:</strong> The script searches for special tokens such as <code>&lt;|system|&gt;</code> and <code>&lt;|user|&gt;</code>. Identifying these is essential for correctly formatting prompts that the model is trained to follow.</li>
            <li><strong>File Properties:</strong> Finally, <code>ls -lh</code> provides a simple way to check the file's size, helping to confirm you are working with the correct model file.</li>
        </ul>
      </Section>

      <Section title="Backend Integration Guide (Self-Hosting)" icon={<ServerIcon />}>
        <p>
          The Aiko360-Instruct model is designed for efficient self-hosting. 
          The following guide provides a production-ready approach to serving the GGUF model via a Python backend and integrating it with a React frontend using live streaming.
        </p>
        
        <h4>Backend Setup: Model Serving with FastAPI & SSE</h4>
        <p>This setup uses <code>llama-cpp-python</code> for high-performance inference and Server-Sent Events (SSE) for streaming.</p>
        <ol>
          <li><strong>Install Dependencies:</strong><pre><code>pip install "llama-cpp-python[server]" fastapi uvicorn</code></pre></li>
          <li><strong>Create `app.py` (FastAPI Server):</strong><pre><code>{backendGuide.python}</code></pre></li>
          <li><strong>Run the Backend Server:</strong><pre><code>uvicorn app:app --host 0.0.0.0 --port 8000</code></pre></li>
        </ol>

        <h4>React Frontend Integration with Streaming</h4>
        <p>This example shows a React component using the native <code>EventSource</code> API to handle the SSE stream.</p>
        <ol>
          <li><strong>Example Streaming Component:</strong><pre><code>{backendGuide.react}</code></pre></li>
        </ol>

        <h4>Efficiency and Accuracy Considerations</h4>
        <ul>
            <li><strong>Model Quantization (Q8_0):</strong> The <code>Q8_0</code> quantization provides a good balance of size/speed and accuracy.</li>
            <li><strong>Hardware Acceleration:</strong> Utilize GPU acceleration for `llama.cpp` by installing `llama-cpp-python` with `cuBLAS` (NVIDIA) or `clBLAST` (AMD/Intel) support for significantly improved performance.</li>
        </ul>
      </Section>
    </div>
  );
};
