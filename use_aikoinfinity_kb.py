# Usage helper for Aikoinfinity Knowledge Base
import torch

kb = torch.load("Aikoinfinity.ptl")

print("ABOUT:", kb.about())
print("\nTOPICS:", kb.list_topics())

print("\nSEARCH (ethics):")
for r in kb.search("ethics privacy safety alignment", k=3):
    print(f"- {r['title']} | score={r['score']:.3f}")
