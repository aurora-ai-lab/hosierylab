export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div data-locale="en">{children}</div>;
}
