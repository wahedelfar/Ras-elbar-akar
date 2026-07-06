import { MapPin, Users, Target, Award } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-center">من نحن</h1>
          <p className="text-lg text-muted-foreground text-center">
            منصة عقارية موثوقة تربط البائعين والمشترين في رأس البر
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* About Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">عن عقارات رأس البر</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            عقارات رأس البر هي منصة عقارية رقمية حديثة تهدف إلى تسهيل عملية البحث والبيع والشراء والإيجار للعقارات في مدينة رأس البر بدمياط. نحن نوفر تجربة آمنة وموثوقة للمستخدمين من خلال واجهة سهلة الاستخدام وخدمة عملاء متميزة.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            منذ تأسيسنا، التزمنا بتقديم أفضل الخدمات العقارية وبناء ثقة قوية مع مستخدمينا. نؤمن أن التكنولوجيا يمكن أن تحسن تجربة العقارات بشكل كبير.
          </p>
        </section>

        {/* Values Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-foreground">قيمنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Value 1 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Target className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">الشفافية</h3>
                  <p className="text-muted-foreground">
                    نؤمن بالشفافية الكاملة في جميع معاملاتنا وتقديم معلومات دقيقة وموثوقة.
                  </p>
                </div>
              </div>
            </div>

            {/* Value 2 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Users className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">خدمة العملاء</h3>
                  <p className="text-muted-foreground">
                    فريقنا مكرس لتقديم أفضل تجربة عملاء ودعم سريع وفعال.
                  </p>
                </div>
              </div>
            </div>

            {/* Value 3 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Award className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">الجودة</h3>
                  <p className="text-muted-foreground">
                    نسعى لتقديم أعلى مستويات الجودة في كل جانب من جوانب خدماتنا.
                  </p>
                </div>
              </div>
            </div>

            {/* Value 4 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">الاختصاص المحلي</h3>
                  <p className="text-muted-foreground">
                    نركز على خدمة سوق رأس البر بعمق وفهم احتياجات المجتمع المحلي.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4 text-foreground">رسالتنا</h3>
              <p className="text-muted-foreground leading-relaxed">
                تسهيل عملية البحث والشراء والبيع والإيجار للعقارات من خلال منصة رقمية آمنة وموثوقة، وتمكين المستخدمين باتخاذ قرارات عقارية مستنيرة.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4 text-foreground">رؤيتنا</h3>
              <p className="text-muted-foreground leading-relaxed">
                أن نصبح المنصة العقارية الرائدة في رأس البر والمنطقة، معروفة بالموثوقية والابتكار وخدمة العملاء المتميزة.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-foreground">فريقنا</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            فريقنا يتكون من متخصصين في مجال العقارات والتكنولوجيا الذين يعملون بجد لتقديم أفضل الخدمات. نحن نؤمن بالعمل الجماعي والابتكار المستمر.
          </p>
        </section>

        {/* Contact Section */}
        <section className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">تواصل معنا</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">البريد الإلكتروني:</span>{" "}
              <a href="mailto:raas.elbar@yahoo.com" className="text-primary hover:underline">
                raas.elbar@yahoo.com
              </a>
            </p>
            <p>
              <span className="font-semibold text-foreground">الهاتف:</span>{" "}
              <a href="tel:+201026569682" className="text-primary hover:underline">
                01026569682
              </a>
            </p>
            <p>
              <span className="font-semibold text-foreground">العنوان:</span> رأس البر، دمياط، مصر
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
