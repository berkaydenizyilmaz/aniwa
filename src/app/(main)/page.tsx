'use client';

export default function HomePage() {
  const colorSections = [
    {
      title: "Ana Renkler",
      colors: [
        { name: "Primary", class: "bg-primary text-primary-foreground", desc: "Ana marka rengi (#5bc0ff)" },
        { name: "Secondary", class: "bg-secondary text-secondary-foreground", desc: "İkincil renk (#374259)" },
        { name: "Background", class: "bg-background text-foreground border", desc: "Ana zemin rengi (#f1f5f9)" },
        { name: "Foreground", class: "bg-foreground text-background", desc: "Ana metin rengi" },
      ]
    },
    {
      title: "Kart ve Popover Renkler",
      colors: [
        { name: "Card", class: "bg-card text-card-foreground border", desc: "Kart zemin rengi" },
        { name: "Popover", class: "bg-popover text-popover-foreground border", desc: "Popover zemin rengi" },
      ]
    },
    {
      title: "Durum Renkleri",
      colors: [
        { name: "Muted", class: "bg-muted text-muted-foreground", desc: "Soluk/pasif renkler" },
        { name: "Accent", class: "bg-accent text-accent-foreground", desc: "Vurgu renkleri" },
        { name: "Destructive", class: "bg-destructive text-destructive-foreground", desc: "Tehlike/hata rengi" },
      ]
    },
    {
      title: "UI Element Renkleri",
      colors: [
        { name: "Border", class: "bg-border text-foreground", desc: "Çerçeve rengi" },
        { name: "Input", class: "bg-input text-foreground border", desc: "Giriş alanı rengi" },
        { name: "Ring", class: "bg-ring text-primary-foreground", desc: "Odak halka rengi" },
      ]
    },
    {
      title: "Sidebar Renkleri",
      colors: [
        { name: "Sidebar", class: "bg-sidebar text-sidebar-foreground border", desc: "Sidebar zemin" },
        { name: "Sidebar Primary", class: "bg-sidebar-primary text-sidebar-primary-foreground", desc: "Sidebar ana renk" },
        { name: "Sidebar Accent", class: "bg-sidebar-accent text-sidebar-accent-foreground", desc: "Sidebar vurgu" },
        { name: "Sidebar Border", class: "bg-sidebar-border text-foreground", desc: "Sidebar çerçeve" },
      ]
    },
    {
      title: "Chart Renkleri",
      colors: [
        { name: "Chart 1", class: "bg-chart-1 text-white", desc: "Grafik rengi 1" },
        { name: "Chart 2", class: "bg-chart-2 text-white", desc: "Grafik rengi 2" },
        { name: "Chart 3", class: "bg-chart-3 text-white", desc: "Grafik rengi 3" },
        { name: "Chart 4", class: "bg-chart-4 text-white", desc: "Grafik rengi 4" },
        { name: "Chart 5", class: "bg-chart-5 text-white", desc: "Grafik rengi 5" },
      ]
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Aniwa Renk Paleti</h1>
          <p className="text-xl text-muted-foreground">
            Mevcut tüm renklerin görsel örnekleri
          </p>
        </div>

        {/* Color Sections */}
        <div className="space-y-8">
          {colorSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-card rounded-lg p-6 border">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.colors.map((color, colorIndex) => (
                  <div key={colorIndex} className="space-y-2">
                    {/* Color Sample */}
                    <div className={`${color.class} p-4 rounded-lg min-h-[80px] flex items-center justify-center font-semibold`}>
                      {color.name}
                    </div>
                    {/* Color Info */}
                    <div className="text-sm">
                      <div className="font-medium text-card-foreground">{color.name}</div>
                      <div className="text-muted-foreground">{color.desc}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        .{color.class.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Theme Toggle Demo */}
        <div className="mt-8 bg-card rounded-lg p-6 border">
          <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
            Tema Değiştirme Testi
          </h2>
          <p className="text-muted-foreground mb-4">
            Sağ üst köşedeki tema değiştirme butonunu kullanarak dark/light mode geçişini test edebilirsiniz.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary text-primary-foreground p-3 rounded text-center font-medium">
              Primary
            </div>
            <div className="bg-secondary text-secondary-foreground p-3 rounded text-center font-medium">
              Secondary
            </div>
            <div className="bg-muted text-muted-foreground p-3 rounded text-center font-medium">
              Muted
            </div>
            <div className="bg-accent text-accent-foreground p-3 rounded text-center font-medium">
              Accent
            </div>
          </div>
        </div>

        {/* CSS Variables Info */}
        <div className="mt-8 bg-muted rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            CSS Değişkenleri
          </h2>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Tüm renkler CSS custom properties olarak tanımlanmış</p>
            <p>• Light ve dark mode için ayrı değerler mevcut</p>
            <p>• Tailwind CSS ile entegre çalışıyor</p>
            <p>• Yeni component&apos;ler otomatik olarak bu renkleri kullanacak</p>
          </div>
        </div>
      </div>
    </div>
  );
}