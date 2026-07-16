with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("import { Logo } from './components/Logo';", "import { Logo } from './components/Logo';\nimport { QuickInquiryForm } from './components/QuickInquiryForm';")

old_grid = """          <div className="grid md:grid-cols-2 gap-12 pb-16 border-b border-white/10">
            <div>
              <div className="mb-8">
                <Logo variant="horizontal" size="lg" className="brightness-200 contrast-125 grayscale-[0.2]" />
              </div>
              <p className="text-gray-300 max-w-sm mb-8 leading-relaxed">
                Beautiful Designs • Premium Quality • Professional Service
              </p>
              <p className="text-gray-300">
                Book your appointment today for bridal mehendi, festivals, functions, and professional mehendi classes.
              </p>
            </div>
            
            <div className="md:justify-self-end">
              <h3 className="text-xl font-semibold text-white mb-6">Contact Us</h3>"""

new_grid = """          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-12 pb-16 border-b border-white/10">
            <div>
              <div className="mb-8">
                <Logo variant="horizontal" size="lg" className="brightness-200 contrast-125 grayscale-[0.2]" />
              </div>
              <p className="text-gray-300 max-w-sm mb-8 leading-relaxed">
                Beautiful Designs • Premium Quality • Professional Service
              </p>
              <p className="text-gray-300">
                Book your appointment today for bridal mehendi, festivals, functions, and professional mehendi classes.
              </p>
            </div>
            
            <div className="lg:justify-self-center w-full max-w-md">
              <QuickInquiryForm />
            </div>

            <div className="lg:justify-self-end">
              <h3 className="text-xl font-semibold text-white mb-6">Contact Us</h3>"""

content = content.replace(old_grid, new_grid)

with open("src/App.tsx", "w") as f:
    f.write(content)
