with open("src/components/QuickInquiryForm.tsx", "r") as f:
    content = f.read()

content = content.replace("import { CONTACT_INFO } from '../data/siteData';", "")
content = content.replace("export function QuickInquiryForm() {", "export function QuickInquiryForm({ contactData }: { contactData?: any }) {")
content = content.replace("CONTACT_INFO", "(contactData || {})")

with open("src/components/QuickInquiryForm.tsx", "w") as f:
    f.write(content)
