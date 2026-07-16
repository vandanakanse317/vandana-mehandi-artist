with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Add import for Logo
content = content.replace("import { Leaf,", "import { Logo } from './components/Logo';\nimport { Leaf,")

# 2. Update Navbar logo
old_nav_logo = """            <div className="flex-shrink-0 flex items-center gap-2">
              <Leaf className="w-12 h-12 text-henna-600" />
              <span className="font-serif text-4xl md:text-5xl font-bold text-henna-900 tracking-tight">Vandana Mehendi Artist</span>
            </div>"""
new_nav_logo = """            <div className="flex-shrink-0 flex items-center">
              <Logo variant="horizontal" size="md" />
            </div>"""
content = content.replace(old_nav_logo, new_nav_logo)

# 3. Update Footer logo
old_footer_logo = """              <div className="flex items-center gap-2 mb-6">
                <Leaf className="w-8 h-8 text-henna-400" />
                <span className="font-serif text-3xl font-bold text-white tracking-tight">Vandana Mehendi</span>
              </div>"""
new_footer_logo = """              <div className="mb-8">
                <Logo variant="horizontal" size="md" className="brightness-200 contrast-125 grayscale-[0.2]" />
              </div>"""
content = content.replace(old_footer_logo, new_footer_logo)

with open("src/App.tsx", "w") as f:
    f.write(content)

