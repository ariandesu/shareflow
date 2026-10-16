# Bottom Sheet Creation Flow

**Category:** Mobile App  
**Tags:** mobile app, layout, user contribution  
**Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)  
**Live Preview:** [https://p.superdesign.dev/draft/e41a04a2-6985-4593-be0c-aba0b46ec6e3](https://p.superdesign.dev/draft/e41a04a2-6985-4593-be0c-aba0b46ec6e3)  
**Local Standalone Preview:** `previews/bottom-sheet-creation-flow.html`

---

## Architectural & Aesthetic Breakdown
Best Use Case: Quick, interruptible creation actions that should not break browsing or navigation context.
Examples: quick add, comments, replies, short forms, quick settings.

---

## Production System Prompt Specification
Copy and paste this into Cursor Composer, Claude 3.5 Sonnet, v0, Bolt.new, or Windsurf:

```markdown
Here is a reference implementation:

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creation Flow Bottom Sheet</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
    <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'General Sans', sans-serif; }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
    </style>
</head>
<body>
    <!-- Root Container -->
    <div class="w-full h-screen bg-gray-50 overflow-hidden relative flex flex-col">
        
        <!-- BACKGROUND LAYER: Existing Page Content (Simulated Context) -->
        <div class="flex-1 flex flex-col w-full opacity-40 scale-[0.98] origin-top transition-all duration-300 pointer-events-none" aria-hidden="true">
            <!-- Fake Header -->
            <header class="pt-14 px-5 pb-4 flex justify-between items-end bg-white border-b border-gray-200">
                <div>
                    <p class="text-gray-500 text-sm font-medium mb-1">Workspace</p>
                    <h1 class="text-3xl font-bold text-gray-900">Projects</h1>
                </div>
                <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">
                    <iconify-icon icon="lucide:user" class="text-xl"></iconify-icon>
                </div>
            </header>

            <!-- Fake Content List -->
            <main class="flex-1 px-5 py-6 space-y-4 overflow-hidden">
                <!-- Item 1 -->
                <div class="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                    <div class="flex justify-between items-start mb-2">
                        <span class="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-semibold">Design</span>
                        <iconify-icon icon="lucide:more-horizontal" class="text-gray-400"></iconify-icon>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1">Q3 Marketing Campaign</h3>
                    <p class="text-sm text-gray-500">Updated 2h ago</p>
                </div>
                <!-- Item 2 -->
                <div class="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                    <div class="flex justify-between items-start mb-2">
                        <span class="px-2.5 py-1 rounded-md bg-orange-50 text-orange-600 text-xs font-semibold">Development</span>
                        <iconify-icon icon="lucide:more-horizontal" class="text-gray-400"></iconify-icon>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1">Mobile App Refactor</h3>
                    <p class="text-sm text-gray-500">Updated 5h ago</p>
                </div>
                <!-- Item 3 -->
                <div class="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                    <div class="flex justify-between items-start mb-2">
                        <span class="px-2.5 py-1 rounded-md bg-purple-50 text-purple-600 text-xs font-semibold">Research</span>
                        <iconify-icon icon="lucide:more-horizontal" class="text-gray-400"></iconify-icon>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1">User Testing Analysis</h3>
                    <p class="text-sm text-gray-500">Updated yesterday</p>
                </div>
            </main>
        </div>

        <!-- OVERLAY BACKDROP -->
        <div class="absolute inset-0 bg-gray-900/20 backdrop-blur-[2px] z-40 transition-opacity duration-300"></div>

        <!-- BOTTOM SHEET COMPONENT -->
        <div class="absolute bottom-0 left-0 right-0 z-50 flex flex-col max-h-[92vh] h-[85vh] bg-white rounded-t-[32px] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom duration-300">
            
            <!-- DRAG HANDLE AREA -->
            <div class="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none">
                <div class="w-12 h-1.5 bg-gray-200 rounded-full"></div>
            </div>

            <!-- SHEET HEADER -->
            <header class="flex-shrink-0 px-6 py-3 flex items-center justify-between border-b border-transparent">
                <h2 class="text-xl font-bold text-gray-900 tracking-tight">Create New Item</h2>
                <button 
                    class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    aria-label="Close sheet"
                >
                    <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
                </button>
            </header>

            <!-- SCROLLABLE FORM CONTENT -->
            <main class="flex-1 overflow-y-auto no-scrollbar px-6 py-2 space-y-6">
                
                <!-- Input Group: Title -->
                <div class="space-y-2">
                    <label for="item-title" class="block text-sm font-semibold text-gray-700">Title</label>
                    <input 
                        type="text" 
                        id="item-title" 
                        placeholder="e.g. Website Redesign"
                        class="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                    >
                </div>

                <!-- Input Group: Category -->
                <div class="space-y-2">
                    <label for="item-category" class="block text-sm font-semibold text-gray-700">Category</label>
                    <div class="relative">
                        <select 
                            id="item-category" 
                            class="w-full appearance-none px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                        >
                            <option value="" disabled selected>Select a category</option>
                            <option value="design">Design</option>
                            <option value="development">Development</option>
                            <option value="marketing">Marketing</option>
                        </select>
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            <iconify-icon icon="lucide:chevron-down" class="text-xl"></iconify-icon>
                        </div>
                    </div>
                </div>

                <!-- Input Group: Description -->
                <div class="space-y-2">
                    <label for="item-desc" class="block text-sm font-semibold text-gray-700">Description</label>
                    <textarea 
                        id="item-desc" 
                        rows="4" 
                        placeholder="Add details about this project..."
                        class="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 resize-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                    ></textarea>
                </div>

                <!-- Input Group: Tags -->
                <div class="space-y-3">
                    <label class="block text-sm font-semibold text-gray-700">Tags</label>
                    <div class="flex flex-wrap gap-2">
                        <!-- Active Tag -->
                        <button class="px-3.5 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium border border-gray-900 flex items-center gap-1.5 transition-transform active:scale-95">
                            <span>High Priority</span>
                            <iconify-icon icon="lucide:x" class="text-white/70"></iconify-icon>
                        </button>
                        
                        <!-- Inactive Tag -->
                        <button class="px-3.5 py-2 rounded-lg bg-white text-gray-600 text-sm font-medium border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors active:scale-95">
                            Internal
                        </button>

                        <!-- Add Button -->
                        <button class="px-3.5 py-2 rounded-lg bg-white text-gray-500 text-sm font-medium border border-dashed border-gray-300 hover:text-gray-700 hover:border-gray-400 transition-colors flex items-center gap-1.5 active:scale-95">
                            <iconify-icon icon="lucide:plus"></iconify-icon>
                            Add Tag
                        </button>
                    </div>
                </div>

                <!-- Spacer for scrolling comfort -->
                <div class="h-4"></div>
            </main>

            <!-- FIXED FOOTER ACTIONS -->
            <!-- pb-[34px] accounts for home indicator safe area -->
            <footer class="flex-shrink-0 p-6 pt-4 bg-white border-t border-gray-100 pb-[34px]">
                <button 
                    class="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-[17px] shadow-lg shadow-gray-900/10 hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <iconify-icon icon="lucide:check-circle" class="text-xl"></iconify-icon>
                    Create Item
                </button>
            </footer>
        </div>
    </div>
</body>
</html>
~~~
```

---
*Generated by ShareFlow Design Prompt Library · © 2026 Mahir Faisal (MHR3D)*
