"""Multi-line aware layering audit: value (non type) imports from data/network layers
into drawing, helper, data and type folders. Run from src/."""
import os
import re

PAT = re.compile(r"import\s+(type\s+)?([\s\S]*?)\s+from\s+'(@/(?:hooks|core/redux|core/services|lib)[^']*)'")

for root in ['design-system/composites', 'design-system/primitives', 'design-system/layouts', 'helpers', 'data', 'types']:
    for dirpath, _, files in os.walk(root):
        for name in sorted(files):
            if not name.endswith(('.ts', '.tsx')):
                continue
            path = os.path.join(dirpath, name).replace(os.sep, '/')
            text = open(path, encoding='utf8').read()
            hits = []
            for m in PAT.finditer(text):
                if m.group(1):
                    continue  # import type: fine
                body = re.sub(r'[{}]', ' ', m.group(2))
                names = [n.strip() for n in body.split(',') if n.strip() and not n.strip().startswith('type ')]
                if not names:
                    continue
                hits.append(f"{m.group(3)} [{', '.join(names)[:90]}]")
            if hits:
                print(path.replace('design-system/', 'ds/'))
                for h in hits:
                    print('    ' + h)
