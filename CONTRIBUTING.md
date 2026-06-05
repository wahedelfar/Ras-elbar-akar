# 🤝 دليل المساهمة | Contributing Guide

شكراً لاهتمامك بالمساهمة في مشروع **عقارات رأس البر**! نحن نقدر كل مساهمة تساعد على تحسين المنصة.

Thank you for your interest in contributing to the **Ras El Bar Real Estate** project! We appreciate every contribution that helps improve the platform.

---

## 📋 قواعد السلوك | Code of Conduct

يرجى الالتزام بـ:
- احترام جميع المساهمين
- التواصل بشكل بناء وإيجابي
- قبول النقد البناء بروح رياضية
- التركيز على ما هو أفضل للمجتمع

---

## 🚀 كيفية المساهمة | How to Contribute

### 1. البلاغ عن الأخطاء | Reporting Bugs

إذا وجدت خطأ، يرجى:
1. التحقق من أنه لم يتم الإبلاغ عنه مسبقاً
2. فتح Issue جديد مع:
   - وصف واضح للمشكلة
   - خطوات إعادة الإنتاج
   - السلوك المتوقع والفعلي
   - لقطات شاشة إن أمكن

### 2. اقتراح ميزات جديدة | Suggesting Features

لاقتراح ميزة جديدة:
1. فتح Issue جديد بعنوان واضح
2. وصف الميزة بالتفصيل
3. شرح الفائدة والحالات الاستخدام
4. توفير أمثلة إن أمكن

### 3. إرسال Pull Requests | Submitting Pull Requests

#### الخطوات:
```bash
# 1. Fork المستودع
git clone https://github.com/yourusername/Ras-elbar-estate.git
cd Ras-elbar-estate

# 2. إنشاء فرع جديد
git checkout -b feature/your-feature-name

# 3. عمل التغييرات
# ... قم بإجراء التعديلات اللازمة

# 4. التأكد من الاختبارات
pnpm test

# 5. Commit التغييرات
git commit -m "Add: وصف واضح للميزة الجديدة"

# 6. Push إلى الفرع
git push origin feature/your-feature-name

# 7. فتح Pull Request على GitHub
```

#### معايير PR:
- ✅ جميع الاختبارات تمر بنجاح
- ✅ الكود يتبع معايير المشروع
- ✅ وصف واضح للتغييرات
- ✅ لا توجد تضاربات مع الفرع الرئيسي

---

## 📝 معايير الكود | Code Standards

### TypeScript
```typescript
// ✅ صحيح
interface PropertyFilter {
  minPrice?: number;
  maxPrice?: number;
  type?: PropertyType;
}

// ❌ خطأ
interface PropertyFilter {
  minPrice,
  maxPrice,
  type
}
```

### React Components
```typescript
// ✅ صحيح
export function PropertyCard({ property }: { property: Property }) {
  return <div>{property.title}</div>;
}

// ❌ خطأ
export const PropertyCard = (props) => {
  return <div>{props.property.title}</div>;
};
```

### Naming Conventions
- **المتغيرات**: camelCase (`propertyId`, `isLoading`)
- **الثوابت**: UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)
- **المكونات**: PascalCase (`PropertyCard`, `AdminDashboard`)
- **الملفات**: kebab-case (`property-detail.tsx`)

---

## 🧪 الاختبارات | Testing

### كتابة الاختبارات
```typescript
import { describe, it, expect } from "vitest";

describe("PropertyService", () => {
  it("should fetch properties successfully", async () => {
    const properties = await getProperties();
    expect(properties).toHaveLength(4);
    expect(properties[0].title).toBe("فيلا فاخرة");
  });

  it("should filter by price", () => {
    const filtered = filterByPrice(properties, 100000, 500000);
    expect(filtered.every(p => p.price >= 100000)).toBe(true);
  });
});
```

### تشغيل الاختبارات
```bash
# تشغيل جميع الاختبارات
pnpm test

# تشغيل اختبار محدد
pnpm test property-detail.test.ts

# مراقبة التغييرات
pnpm test --watch
```

---

## 📚 الوثائق | Documentation

عند إضافة ميزة جديدة:
1. أضف تعليقات واضحة في الكود
2. حدّث ملف README إن لزم الأمر
3. أضف أمثلة الاستخدام
4. وثّق أي متغيرات بيئية جديدة

### تنسيق التعليقات
```typescript
/**
 * جلب جميع العقارات مع الفلترة
 * @param filters - معايير الفلترة
 * @returns قائمة العقارات المفلترة
 */
export async function getProperties(filters: PropertyFilter) {
  // التنفيذ
}
```

---

## 🔄 عملية المراجعة | Review Process

1. **الفحص الأولي**: التحقق من معايير الكود
2. **الاختبارات**: التأكد من نجاح جميع الاختبارات
3. **المراجعة**: مراجعة الكود من قبل المشرفين
4. **التعليقات**: معالجة أي تعليقات أو طلبات تعديل
5. **الموافقة**: دمج PR عند الموافقة

---

## 🎯 أولويات المساهمة | Contribution Priorities

### أولوية عالية 🔴
- إصلاح الأخطاء الحرجة
- تحسينات الأمان
- تحسينات الأداء

### أولوية متوسطة 🟡
- ميزات جديدة مطلوبة
- تحسينات UX/UI
- توثيق أفضل

### أولوية منخفضة 🟢
- تحسينات جمالية
- تنظيف الكود
- تحديثات المكتبات

---

## 📞 الدعم | Support

إذا كان لديك أسئلة:
1. تحقق من الوثائق أولاً
2. ابحث في Issues السابقة
3. فتح Discussion جديد
4. تواصل مع المشرفين

---

## 🙏 شكر لك | Thank You

شكراً لمساهمتك في جعل **عقارات رأس البر** أفضل! 🎉

Thank you for contributing to making **Ras El Bar Real Estate** better! 🎉

---

**Happy Contributing! 🚀**
