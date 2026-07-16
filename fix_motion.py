with open("src/App.tsx", "r") as f:
    lines = f.readlines()

# Line 192 is `      </motion.div>\n` inside Why Choose Us. We need it to be `      </div>\n`.
if 'Why Choose Us' in "".join(lines[170:180]):
    for i in range(175, 195):
        if '</motion.div>' in lines[i]:
            lines[i] = lines[i].replace('</motion.div>', '</div>')
            break

# Line 207 is `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">`
# We want it to be `<motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">`
for i in range(200, 215):
    if 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full' in lines[i]:
        lines[i] = lines[i].replace('<div className="max-w-7xl', '<motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="max-w-7xl')
        break

with open("src/App.tsx", "w") as f:
    f.writelines(lines)
