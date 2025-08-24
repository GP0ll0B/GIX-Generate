
# Aiko360-Instruct — Starter Repo

A production-lean starter to build, align, quantize, and serve a **~360M** instruction-following model for the Aikoinfinity ecosystem.

## What you get
- **SFT & DPO training** (QLoRA-ready) using 🤗 Transformers, TRL, and PEFT.
- **Consistent chat template** for data+inference.
- **GGUF export + quantization** scripts (q8_0 by default).
- **Safety workflow** aligned with G|I|X principles.
- **Eval harness** examples and a model card skeleton.

## Quickstart
```bash
# 0) Environment (Python 3.10+)
pip install -r requirements.txt

# 1) Train SFT (with LoRA/QLoRA)
python scripts/train_sft.py --config configs/train_sft.yaml

# 2) Preference optimize (DPO)
python scripts/train_dpo.py --config configs/train_dpo.yaml

# 3) Merge LoRA and export to HF-format weights
python scripts/merge_lora.py --base allenai/OLMo-350m --adapters outputs/aiko360-sft-lora --out outputs/Aiko360-Instruct

# 4) Convert to GGUF and quantize (requires llama.cpp)
bash deployment/convert_to_gguf.sh outputs/Aiko360-Instruct aiko360-instruct-f16.gguf
bash deployment/quantize.sh aiko360-instruct-f16.gguf aiko360-instruct-q8_0.gguf

# 5) Serve with llama.cpp
llama-cli -m aiko360-instruct-q8_0.gguf -p "Hello!"
```

## Chat template
This template is used **everywhere** (data, training, evals, inference):
```
<|system|>
You are Aiko360-Instruct, an ethical, succinct assistant aligned with G|I|X principles.
<|user|>
{user_text}
<|assistant|>
```

## Repo layout
```
data/
  sft/            # Supervised fine-tuning JSONL
  dpo/            # Preference pairs JSONL
  safety/         # Safety prompts & policies
configs/          # YAML configs for training
scripts/          # Training, merging, utils
evals/            # Eval scripts & task lists
deployment/       # GGUF conversion & quantization
assets/           # Logos or docs
```

---
**License:** Apache-2.0 (adjust if your base requires otherwise)
