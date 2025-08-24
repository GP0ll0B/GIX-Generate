import React from 'react';
import { InfoIcon, CodeIcon, ServerIcon, LightningBoltIcon, CubeIcon, ChartBarIcon, DocumentTextIcon } from './ui/icons';

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-md border border-white/20 dark:border-white/10 p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center gap-2">
            {icon}
            {title}
        </h3>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-ul:list-disc prose-ul:list-inside prose-code:text-xs prose-code:bg-gray-200/50 prose-code:dark:bg-gray-900/50 prose-code:p-1 prose-code:rounded-md prose-code:font-mono">
            {children}
        </div>
    </div>
);

const CodeBlock: React.FC<{ code: string, lang?: string }> = ({ code, lang = 'bash' }) => (
    <pre className="bg-gray-900/80 text-gray-300 text-xs rounded-lg p-4 font-mono overflow-x-auto my-2">
        <code className={`language-${lang}`}>{code.trim()}</code>
    </pre>
);

const promptTemplate = `
<|system|>
You are Aiko360-Instruct, an ethical, succinct assistant aligned with G|I|X principles.
<|user|>
{user_text}
<|assistant|>
`;

const citationText = `
@misc{aiko360_instruct_2024,
  author       = {Gazi Pollob Hussain and AikoInfinity Contributors},
  title        = {Aiko360-Instruct: A ~360M Instruction-Following Model},
  year         = {2024},
  publisher    = {AikoInfinity},
  url          = {https://github.com/GP0ll0B/G-I-X-Generate}
}
`;

const backendApiCode = `
from fastapi import FastAPI, UploadFile
from pydantic import BaseModel
# Assuming 'aiko360' is a module with these functions
from aiko360 import load_model, generate_content, post_to_facebook

app = FastAPI()
model = load_model("aiko360-instruct-q8_0.gguf")

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 200

@app.post("/generate")
async def generate(request: GenerateRequest):
    result = generate_content(model, request.prompt, request.max_tokens)
    return {"generated_text": result}

@app.post("/post/facebook")
async def post_facebook(prompt: str, media: UploadFile = None):
    result = generate_content(model, prompt)
    fb_response = post_to_facebook(result, media)
    return {"fb_status": fb_response}
`;

const systemdServiceFile = `
[Unit]
Description=Aiko360-Instruct FastAPI Service
After=network.target

[Service]
User=aiko
Group=aiko
WorkingDirectory=/home/aiko/aiko360-instruct
ExecStart=/usr/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
`;

const pytorchTrainingCode = `
import torch
import torch.nn as nn
import pytorch_lightning as pl
from torch.utils.data import DataLoader, Dataset
from typing import Optional, Tuple

# For demonstration, we'll use a dummy dataset.
class DummyDataset(Dataset):
    def __init__(self, num_samples: int = 1000):
        self.data = torch.randn(num_samples, 10) # Dummy input features
        self.targets = torch.randn(num_samples, 20) # Dummy target features

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, torch.Tensor]:
        return self.data[idx], self.targets[idx]

# Define the Generator Network
class GeneratorNetwork(nn.Module):
    def __init__(self, input_dim: int, output_dim: int):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 256),
            nn.ReLU(),
            nn.Linear(256, output_dim),
            nn.Tanh()
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)

# PyTorch Lightning Module for the Generator
class GeneratorPL(pl.LightningModule):
    def __init__(self, input_dim: int, output_dim: int, learning_rate: float = 1e-3):
        super().__init__()
        self.save_hyperparameters()
        self.generator = GeneratorNetwork(input_dim, output_dim)
        self.learning_rate = learning_rate
        self.loss_fn = nn.MSELoss() 

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.generator(x)

    def training_step(self, batch: Tuple[torch.Tensor, torch.Tensor], batch_idx: int) -> torch.Tensor:
        inputs, targets = batch
        generated_output = self.generator(inputs)
        loss = self.loss_fn(generated_output, targets)
        self.log("train_loss", loss, on_step=True, on_epoch=True, prog_bar=True, logger=True)
        return loss

    def validation_step(self, batch: Tuple[torch.Tensor, torch.Tensor], batch_idx: int):
        inputs, targets = batch
        generated_output = self.generator(inputs)
        loss = self.loss_fn(generated_output, targets)
        self.log("val_loss", loss, on_step=False, on_epoch=True, prog_bar=True, logger=True)

    def configure_optimizers(self):
        optimizer = torch.optim.Adam(self.parameters(), lr=self.learning_rate)
        return optimizer

    def setup(self, stage: Optional[str] = None):
        self.train_dataset = DummyDataset()
        self.val_dataset = DummyDataset(num_samples=200)

    def train_dataloader(self):
        return DataLoader(self.train_dataset, batch_size=32, shuffle=True)

    def val_dataloader(self):
        return DataLoader(self.val_dataset, batch_size=32)

# Main script to run the training process
if __name__ == "__main__":
    model = GeneratorPL(input_dim=10, output_dim=20)
    trainer = pl.Trainer(max_epochs=10, accelerator='auto')
    trainer.fit(model)
`;


export const AikoModelCard: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto animate-fade-in-fast space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Aiko360-Instruct Model Card
                </h2>
                <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
                   A practical developer guide for the Aiko360-Instruct model.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
                <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Architecture</p>
                    <p className="font-bold text-gray-800 dark:text-gray-200">~360M Parameters</p>
                </div>
                 <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Context Window</p>
                    <p className="font-bold text-gray-800 dark:text-gray-200">4096 Tokens</p>
                </div>
                 <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">License</p>
                    <p className="font-bold text-gray-800 dark:text-gray-200">Apache-2.0</p>
                </div>
            </div>

            <Section title="Intended Use" icon={<InfoIcon />}>
                <p>
                   Aiko360-Instruct is a compact, instruction-following assistant designed for the Aikoinfinity ecosystem. It is optimized for on-device and resource-constrained environments.
                </p>
                <ul>
                    <li><strong>Primary Tasks:</strong> Question Answering, Summarization, Rewriting, and general instruction-following.</li>
                    <li><strong>Core Principle:</strong> To provide succinct, ethical, and helpful responses aligned with G|I|X principles.</li>
                </ul>
            </Section>

            <Section title="Limitations & Bias" icon={<InfoIcon />}>
                <p>
                    As with all language models, Aiko360-Instruct may produce inaccurate or biased content. It should be used as an aid and not as a definitive source of truth. The model's knowledge is limited to its training data and it does not have access to real-time information. A safety workflow aligned with G|I|X principles has been integrated, but users should exercise critical judgment.
                </p>
            </Section>

             <Section title="Training & Alignment" icon={<LightningBoltIcon />}>
                <p>
                    The model is aligned using a two-stage process to ensure high-quality instruction following:
                </p>
                <ul>
                    <li><strong>Supervised Fine-Tuning (SFT):</strong> The base model is fine-tuned on a curated dataset of high-quality instruction-response pairs.</li>
                    <li><strong>Direct Preference Optimization (DPO):</strong> Further alignment is achieved using DPO on a dataset of preference pairs, teaching the model to distinguish between better and worse responses.</li>
                </ul>
                <p>The training process is QLoRA-ready and utilizes libraries such as 🤗 Transformers, TRL, and PEFT.</p>
            </Section>
            
             <Section title="Training Script Example (PyTorch Lightning)" icon={<CodeIcon />}>
                <p>
                    The following is a simplified example of how a generator model, similar in principle to the base for Aiko360-Instruct, can be defined and trained using PyTorch Lightning. This script illustrates the core concepts of defining a network, preparing a dummy dataset, and setting up an automated training loop.
                </p>
                <CodeBlock code={pytorchTrainingCode} lang="python" />
            </Section>
            
            <Section title="Prompt Template" icon={<CodeIcon />}>
                <p>For consistent performance, all prompts for training, evaluation, and inference must follow this chat template:</p>
                <CodeBlock code={promptTemplate} lang="text" />
            </Section>
            
            <Section title="Quantization" icon={<CubeIcon />}>
                <p>
                    The model is designed to be exported to GGUF format for efficient inference with tools like <code>llama.cpp</code>. Quantization significantly reduces the model's size with a minimal impact on performance.
                </p>
                <ul>
                    <li>The default recommended quantization is <code>q8_0</code>, which offers near-FP16 quality at roughly half the size.</li>
                    <li>More aggressive options like <code>Q4_K_M</code> or <code>Q5_K_M</code> are available for environments where memory is extremely limited, offering a trade-off between size and accuracy.</li>
                </ul>
            </Section>
            
            <Section title="Evaluation" icon={<ChartBarIcon />}>
                <p>
                    Model performance should be evaluated using a combination of standard academic benchmarks and custom safety probes. The starter repository includes an evaluation harness.
                </p>
                <ul>
                    <li><strong>Standard Benchmarks:</strong> Common tasks from frameworks like <code>lm-eval-harness</code> (e.g., MMLU, ARC, HellaSwag).</li>
                    <li><strong>Safety Probes:</strong> Custom evaluation sets designed to test the model's alignment with G|I|X safety principles.</li>
                </ul>
            </Section>

            <Section title="Backend API Example (FastAPI)" icon={<CodeIcon />}>
                <p>
                    This sample FastAPI server loads the quantized model and exposes endpoints for generation and Facebook posting.
                </p>
                <CodeBlock code={backendApiCode} lang="python" />
            </Section>
            
            <Section title="Deployment Example (systemd)" icon={<ServerIcon />}>
                <p>
                    Run the FastAPI backend as a resilient production service using <code>systemd</code>.
                </p>
                <CodeBlock code={systemdServiceFile} lang="ini" />
            </Section>

            <Section title="Citation" icon={<DocumentTextIcon />}>
                <p>If you use Aiko360-Instruct in your work, please cite it as follows:</p>
                <CodeBlock code={citationText} lang="bibtex" />
            </Section>

        </div>
    );
};