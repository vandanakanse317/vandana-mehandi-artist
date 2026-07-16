with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace('<div className="relative z-20', '<motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="relative z-20')

content = content.replace('</div>\n      </section>', '</motion.div>\n      </section>')
content = content.replace('</div>\n      </footer>', '</motion.div>\n      </footer>')

with open("src/App.tsx", "w") as f:
    f.write(content)
