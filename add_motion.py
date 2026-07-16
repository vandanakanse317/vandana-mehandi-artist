with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { motion } from 'motion/react';")

# Just wrap the <div className="relative z-20 w-full..."> content in <motion.div> for all sections
import re
def wrap_with_motion(match):
    prefix = match.group(1)
    inner = match.group(2)
    # We don't want to wrap the wrapper, just add it to the wrapper itself!
    # className="relative z-20 w-full..." -> <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="...">
    return prefix.replace('<div className="relative z-20', '<motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="relative z-20') + inner.replace('</div>\n      </section>', '</motion.div>\n      </section>')

# E.g.
# <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
# we can just find '<div className="relative z-20' and replace with '<motion.div ... className="relative z-20'
# and then replace the matching '</div>' with '</motion.div>'.
# This is hard with regex.

