const fs = require('fs');
let code = fs.readFileSync('contexts/SettingsContext.tsx', 'utf-8');

const search = `      if (data) {
        setSettings({ ...defaultSettings, ...data });
      } else if (error && error.code === 'PGRST116') {`;

const replace = `      if (data) {
        // Migration logic
        let cols = data.portfolio_collections;
        if (cols && cols.some(c => c.name === 'Latest Designs')) {
          const newCols = [
            { id: '1', name: 'Bridal Collection', cover_image: '' },
            { id: '2', name: 'Arabic Collection', cover_image: '' },
            { id: '3', name: 'Traditional Collection', cover_image: '' },
            { id: '5', name: 'Flower Decoration', cover_image: '' }
          ];
          newCols.forEach(nc => {
            const existing = cols.find(ec => ec.name === nc.name);
            if (existing) nc.cover_image = existing.cover_image;
          });
          data.portfolio_collections = newCols;
          supabase.from('settings').update({ portfolio_collections: newCols }).eq('id', 1).then();
        }
        setSettings({ ...defaultSettings, ...data });
      } else if (error && error.code === 'PGRST116') {`;

code = code.replace(search, replace);
fs.writeFileSync('contexts/SettingsContext.tsx', code);
