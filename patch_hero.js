const fs = require('fs');
let code = fs.readFileSync('components/Hero.tsx', 'utf-8');

code = code.replace(
  "import { useEffect, useState } from 'react';",
  "import { useEffect, useState } from 'react';\nimport { useSettings } from '../contexts/SettingsContext';"
);

code = code.replace(
  "export function Hero() {\n  return (",
  "export function Hero() {\n  const { settings } = useSettings();\n  return ("
);

code = code.replace(
  /<h1 className="font-serif text-5xl font-semibold leading-\[1.05\] text-white sm:text-6xl lg:text-8xl">[\s\S]*?<\/h1>/,
  "<h1 className=\"font-serif text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-8xl whitespace-pre-line\">{settings.heroHeading}</h1>"
);

code = code.replace(
  /<p className="mt-7 max-w-2xl text-lg leading-8 text-stone-300">.*?<\/p>/,
  '<p className="mt-7 max-w-2xl text-lg leading-8 text-stone-300">{settings.heroSubtitle}</p>'
);

fs.writeFileSync('components/Hero.tsx', code);
