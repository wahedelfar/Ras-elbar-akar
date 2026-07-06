

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="prose prose-sm max-w-none dark:prose-invert" dir="rtl">
        <h1 className="text-3xl font-bold mb-6 text-foreground">سياسة الخصوصية</h1>
        
        <p className="text-muted-foreground mb-6">
          آخر تحديث: يوليو 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">مقدمة</h2>
          <p className="text-muted-foreground mb-4">
            نحن في عقارات رأس البر نقدّر خصوصيتك. تشرح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لبيانات المستخدمين.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">البيانات التي نجمعها</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>بيانات التسجيل (الاسم، البريد الإلكتروني، رقم الهاتف)</li>
            <li>بيانات الملف الشخصي (الصورة، البيانات الشخصية)</li>
            <li>بيانات الإعلانات (العقارات المضافة، التعديلات)</li>
            <li>بيانات الاستخدام (سجل الزيارات، النقرات، البحث)</li>
            <li>بيانات الجهاز (عنوان IP، نوع المتصفح، نظام التشغيل)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">كيف نستخدم بيانات المستخدمين</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>تقديم وتحسين الخدمات</li>
            <li>التواصل معك بخصوص حسابك والإعلانات</li>
            <li>تحليل الاستخدام وتحسين تجربة المستخدم</li>
            <li>الامتثال للقوانين والمتطلبات القانونية</li>
            <li>منع الاحتيال والأنشطة غير القانونية</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Google Analytics</h2>
          <p className="text-muted-foreground mb-4">
            نستخدم Google Analytics لتحليل كيفية استخدام الموقع. يمكنك رفض هذا عبر Cookie Consent Banner. اقرأ 
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {" "}سياسة خصوصية Google
            </a>
            {" "}لمزيد من المعلومات.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">ملفات تعريف الارتباط (Cookies)</h2>
          <p className="text-muted-foreground mb-4">
            نستخدم ملفات تعريف الارتباط لتحسين تجربتك. يمكنك التحكم في الـ cookies من خلال إعدادات متصفحك أو Cookie Consent Banner.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">حماية البيانات</h2>
          <p className="text-muted-foreground mb-4">
            نحن نتخذ إجراءات أمنية معقولة لحماية بيانات المستخدمين من الوصول غير المصرح به والتعديل والحذف.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">حقوق المستخدمين</h2>
          <p className="text-muted-foreground mb-4">
            لديك الحق في:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>الوصول إلى بيانات المستخدم الخاصة بك</li>
            <li>تصحيح البيانات غير الدقيقة</li>
            <li>حذف حسابك والبيانات المرتبطة به</li>
            <li>الاعتراض على معالجة البيانات</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">التواصل معنا</h2>
          <p className="text-muted-foreground">
            إذا كان لديك أسئلة حول هذه السياسة، يرجى التواصل معنا:
          </p>
          <div className="mt-4 space-y-2 text-muted-foreground">
            <p>البريد الإلكتروني: <a href="mailto:raas.elbar@yahoo.com" className="text-primary hover:underline">raas.elbar@yahoo.com</a></p>
            <p>الهاتف: <a href="tel:+201026569682" className="text-primary hover:underline">01026569682</a></p>
            <p>العنوان: رأس البر، دمياط، مصر</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">التعديلات على السياسة</h2>
          <p className="text-muted-foreground">
            قد نحدث هذه السياسة من وقت لآخر. سيتم إخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على الموقع.
          </p>
        </section>
      </div>
    </div>
  );
}
