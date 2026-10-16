import os
import glob
import subprocess
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

screenshots_dir = 'public/screenshots'
bundle_dir = 'public/products/prompts_bundle'
pngs = sorted(glob.glob(os.path.join(screenshots_dir, '*.png')))

def process_one(p):
    slug = os.path.splitext(os.path.basename(p))[0]
    try:
        im = Image.open(p)
        if im.mode == 'P':
            # Already quantized
            b_target = os.path.join(bundle_dir, slug, 'screenshot.png')
            if os.path.exists(os.path.dirname(b_target)) and (not os.path.exists(b_target) or os.path.getsize(b_target) != os.path.getsize(p)):
                im.save(b_target, optimize=True)
            return True

        q = im.quantize(colors=256, method=Image.Quantize.MEDIANCUT)
        q.save(p, optimize=True)
        b_target = os.path.join(bundle_dir, slug, 'screenshot.png')
        if os.path.exists(os.path.dirname(b_target)):
            q.save(b_target, optimize=True)
        return True
    except Exception as e:
        print(f"Error {slug}: {e}")
        return False

if __name__ == '__main__':
    print(f"Optimizing {len(pngs)} images...")
    with ThreadPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(process_one, pngs))
    print(f"Successfully processed {sum(results)} / {len(pngs)} screenshots.")

    print("Recreating zip bundle...")
    zip_path = 'public/products/shareflow-superdesign-prompts-and-previews.zip'
    if os.path.exists(zip_path):
        os.remove(zip_path)

    cmd = ['zip', '-q', '-r', 'shareflow-superdesign-prompts-and-previews.zip', 'prompts_bundle']
    subprocess.run(cmd, cwd='public/products', check=True)

    size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"New zip bundle created at {zip_path}: {size_mb:.2f} MB")
