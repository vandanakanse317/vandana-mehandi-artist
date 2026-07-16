import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# We just need to replace `</section>` of hero with `</div></section>`
# Since the hero is right before services, we can do:
content = content.replace('</section>\n      {/* Services Section */}', '</div>\n      </section>\n      {/* Services Section */}')
# Just in case there are other spaces:
content = re.sub(r'</section>\s*\{\/\* Services Section \*\/\}', r'</div>\n      </section>\n      {/* Services Section */}', content)

with open("src/App.tsx", "w") as f:
    f.write(content)
