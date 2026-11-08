"use client";
import { useRef, useState } from "react";
import {
  Field, NumberField, Toggle, Group, IconSelect, ImageField, ListEditor, StringList,
  TitleFields, Uploader, makeBind, getIn, ghost, danger, inputCls,
} from "./ui";
import { videoPoster } from "@/lib/cloudinary";
import { makePoster } from "@/lib/videoFrame";
import { RATIOS, ratioCss, snapRatio } from "@/lib/ratio";
import { DEFAULT_CONTENT as D } from "@/data/defaults";
import MessagesTab from "./Messages";

/* ===================== الصفحة الرئيسية والنبذة ===================== */
function HeroTab({ c, set }) {
  const { b } = makeBind(c, set);
  return (
    <Group title="أول الصفحة (الهيرو)">
      <ImageField label="صورة الخلفية" fallback={D.hero.img} {...b("hero.img")} />
      <Field label="وصف الصورة (Alt)" {...b("hero.alt")} />
      <Field label="السطر الصغير فوق العنوان" {...b("hero.eyebrow")} />
      <TitleFields parts={["العنوان - الجزء الأول", "العنوان - الكلمة المميزة (ذهبي مائل)"]} {...b("hero.title")} />
      <Field label="الوصف" multiline {...b("hero.text")} />
      <Field label="نص الزرار الأول" {...b("hero.cta1")} />
      <Field label="نص الزرار التاني" {...b("hero.cta2")} />
    </Group>
  );
}

function AboutTab({ c, set }) {
  const { b } = makeBind(c, set);
  return (
    <Group title="نبذة عني (Meet)">
      <ImageField label="الصورة" fallback={D.about.img} {...b("about.img")} />
      <Field label="وصف الصورة (Alt)" {...b("about.alt")} />
      <Field label="السطر الصغير" {...b("about.label")} />
      <Field label="العنوان" {...b("about.title")} />
      <Field label="الكلام (Quote)" multiline rows={5} {...b("about.quote")} />
      <Field label="التوقيع" {...b("about.sign")} />
      <Field label="نص الزرار" {...b("about.cta")} />
    </Group>
  );
}

function StatsTab({ c, set }) {
  const { l } = makeBind(c, set);
  return (
    <div className="grid gap-4">
      <Group title="الأرقام">
        <ListEditor
          {...l("stats")}
          itemLabel="رقم"
          addLabel="إضافة رقم"
          newItem={() => ({ value: "", label: "" })}
          render={(it, patch) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="الرقم (مثال: 58+)" value={it.value} onChange={(v) => patch({ value: v })} />
              <Field label="الوصف" value={it.label} onChange={(v) => patch({ label: v })} />
            </div>
          )}
        />
      </Group>
      <Group title="الشريط المتحرك (المميزات)">
        <ListEditor
          {...l("perks")}
          itemLabel="ميزة"
          addLabel="إضافة ميزة"
          newItem={() => ({ icon: "camera", text: "" })}
          render={(it, patch) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <IconSelect label="الأيقونة" value={it.icon} onChange={(v) => patch({ icon: v })} />
              <Field label="النص" value={it.text} onChange={(v) => patch({ text: v })} />
            </div>
          )}
        />
      </Group>
    </div>
  );
}

/* ===================== البورتفوليو ===================== */
function PortfolioTab({ c, set }) {
  const { b } = makeBind(c, set);
  return (
    <Group title="عناوين البورتفوليو">
      <Field label="السطر الصغير" {...b("portfolio.label")} />
      <TitleFields
        parts={["العنوان - البداية", "الكلمة المميزة (ذهبي مائل)", "العنوان - النهاية"]}
        {...b("portfolio.title")}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="اسم تاب الصور" {...b("portfolio.photosTab")} />
        <Field label="اسم تاب الأفلام" {...b("portfolio.filmsTab")} />
        <Field label="اسم تاب الريلز" {...b("portfolio.reelsTab")} />
      </div>
      <p className="text-xs text-mute">التاب اللي مفيهوش محتوى بيختفي من الموقع تلقائياً.</p>
    </Group>
  );
}

function FolderItem({ f, patch }) {
  const photos = (f.photos || []).filter(Boolean);
  return (
    <div className="grid gap-4">
      <Field label="اسم الألبوم (مثال: Lena & Marc)" value={f.name} onChange={(v) => patch({ name: v })} />

      <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
        {f.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={f.cover} alt="" className="h-24 w-[72px] rounded-lg border border-line bg-sand object-cover" />
        ) : (
          <span className="grid h-24 w-[72px] place-items-center rounded-lg border border-dashed border-line text-center text-[10px] text-mute">
            مفيش غلاف
          </span>
        )}
        <div className="grid gap-2">
          <p className="text-xs font-semibold text-mute">غلاف الألبوم (اللي بيظهر في الموقع)</p>
          <Uploader
            label="رفع صورة غلاف مخصصة"
            accept="image/*"
            doneText="تم تغيير الغلاف ✓ (اضغط حفظ ونشر)"
            onDone={(r) => patch({ cover: r.url })}
          />
        </div>
      </div>

      <Uploader
        label="+ رفع صور للألبوم (تقدر تختار كذا صورة مرة واحدة)"
        accept="image/*"
        multiple
        doneText="تم رفع الصور ✓ (اضغط حفظ ونشر)"
        onDone={(r) => patch((x) => ({ photos: [...(x.photos || []), r.url], cover: x.cover || r.url }))}
      />
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {photos.map((url, i) => (
            <div key={url + i} className="grid gap-1.5">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-line bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
                {f.cover === url && (
                  <span className="absolute start-1 top-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-white">
                    الغلاف
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                {f.cover !== url && (
                  <button type="button" className={`${ghost} !px-2 !py-1 !text-[10px]`} onClick={() => patch({ cover: url })}>
                    خليها غلاف
                  </button>
                )}
                <button
                  type="button"
                  aria-label="حذف الصورة"
                  className={`${danger} !px-2 !py-1 !text-[10px]`}
                  onClick={() =>
                    patch((x) => {
                      const rest = (x.photos || []).filter((_, k) => k !== i);
                      return { photos: rest, cover: x.cover === url ? rest[0] || "" : x.cover };
                    })
                  }
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PhotosTab({ c, set }) {
  const { l } = makeBind(c, set);
  return (
    <Group title={`ألبومات الصور (${c.portfolio.folders.length})`}>
      <p className="text-xs text-mute">
        الصور الكبيرة بتتصغّر تلقائياً قبل الرفع (أقصى 2400px). لو في ألبومات تجريبية قديمة احذفها.
      </p>
      <ListEditor
        {...l("portfolio.folders")}
        itemLabel="ألبوم"
        addLabel="إضافة ألبوم"
        newItem={() => ({ id: `f${Date.now()}`, name: "", cover: "", photos: [] })}
        render={(f, patch) => <FolderItem f={f} patch={patch} />}
      />
    </Group>
  );
}

function RatioSelect({ label, value, onChange, withAuto = false }) {
  const known = RATIOS.some(([k]) => k === value);
  return (
    <label className="grid gap-1.5 text-xs font-semibold text-mute">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {withAuto && <option value="auto">تلقائي (حسب الفيديو نفسه)</option>}
        {!known && value && value !== "auto" && <option value={value}>مخصص {value}</option>}
        {RATIOS.map(([k, name]) => (
          <option key={k} value={k}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}

function VideoItem({ v, patch, kind }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const def = kind === "film" ? "16:9" : "9:16";
  const ratio = v.ratio || def;
  const wide = Number(ratio.split(":")[0]) > Number(ratio.split(":")[1]);

  // Grab the frame at second `at`, upload it as a normal image and use it as the cover.
  async function frame(at) {
    setBusy(true);
    setMsg("");
    const t = Math.round(at * 10) / 10;
    const r = await makePoster(v.src, { at: t, cross: true, fallbackUrl: videoPoster(v.src, t) });
    if (r.url) {
      patch({ poster: r.url });
      setMsg("تم تغيير الغلاف ✓ (اضغط حفظ ونشر)");
    } else {
      setMsg("تعذر استخراج الصورة من الفيديو، ارفع صورة غلاف بدالها.");
    }
    setBusy(false);
  }

  return (
    <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
      <div className="grid content-start gap-2">
        <video
          ref={ref}
          src={v.src}
          poster={v.poster || undefined}
          controls
          preload="metadata"
          playsInline
          style={{ aspectRatio: ratioCss(ratio, def) }}
          className={`rounded-xl bg-black object-cover ${wide ? "w-72" : "w-44"}`}
        />
        <p className="text-[11px] text-mute">المعاينة بنفس شكل الكارت في الموقع</p>
      </div>

      <div className="grid content-start gap-3">
        <RatioSelect label="أبعاد الكارت" value={ratio} onChange={(x) => patch({ ratio: x })} />

        <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
          {v.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={v.poster}
              alt=""
              style={{ aspectRatio: ratioCss(ratio, def) }}
              className={`rounded-lg border border-line bg-sand object-cover ${wide ? "w-28" : "w-14"}`}
            />
          ) : (
            <span className="grid h-16 w-14 place-items-center rounded-lg border border-dashed border-line text-center text-[10px] text-mute">
              مفيش غلاف
            </span>
          )}
          <p className="text-xs font-semibold text-mute">الغلاف الحالي</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            className={ghost}
            onClick={() => frame(ref.current?.currentTime || 0)}
          >
            {busy ? "جاري التجهيز…" : "استخدم الفريم الحالي كغلاف"}
          </button>
          <button type="button" disabled={busy} className={ghost} onClick={() => frame(1)}>
            غلاف تلقائي (ثانية 1)
          </button>
          <Uploader
            label="رفع صورة غلاف"
            accept="image/*"
            doneText="تم تغيير الغلاف ✓ (اضغط حفظ ونشر)"
            onDone={(r) => patch({ poster: r.url })}
          />
          <Uploader
            label="استبدال الفيديو"
            accept="video/*"
            onDone={async (r, file) => {
              const blobUrl = URL.createObjectURL(file);
              const p = await makePoster(blobUrl, { at: 1, fallbackUrl: videoPoster(r.url, 1) });
              URL.revokeObjectURL(blobUrl);
              patch({ src: r.url, poster: p.url });
            }}
          />
        </div>
        <p className="text-[11px] leading-5 text-mute">
          للغلاف من لقطة معينة: شغّل الفيديو فوق، وقّفه عند اللقطة اللي عايزها، واضغط "استخدم الفريم الحالي كغلاف".
        </p>
        {msg && <p className="text-xs font-semibold text-green-700">{msg}</p>}

      </div>
    </div>
  );
}

function VideoList({ c, set, path, kind, title, children }) {
  const { l } = makeBind(c, set);
  const list = l(path);
  const def = kind === "film" ? "16:9" : "9:16";
  const [sel, setSel] = useState("auto");

  // After each video is uploaded: grab a cover frame from the local file, detect/choose the ratio.
  async function onVideo(r, file) {
    const blobUrl = URL.createObjectURL(file);
    const p = await makePoster(blobUrl, { at: 1, fallbackUrl: videoPoster(r.url, 1) });
    URL.revokeObjectURL(blobUrl);
    let ratio = sel;
    if (sel === "auto") ratio = snapRatio(r.width, r.height) || snapRatio(p.width, p.height) || def;
    list.onChange((prev) => [{ src: r.url, poster: p.url, ratio }, ...prev]);
  }

  return (
    <div className="grid gap-4">
      {children}
      <Group title={`${title} (${(list.items || []).length})`}>
        <div className="grid gap-3 rounded-2xl border border-line bg-cream/60 p-4">
          <RatioSelect
            label="أبعاد الفيديوهات اللي هترفعها (الكارت في الموقع هيبقى بنفس الأبعاد دي)"
            value={sel}
            onChange={setSel}
            withAuto
          />
          <Uploader
            label="+ رفع فيديوهات جديدة (تقدر تختار أكتر من واحد)"
            accept="video/*"
            multiple
            doneText="تم رفع الفيديوهات ✓ (اضغط حفظ ونشر)"
            onDone={onVideo}
          />
        </div>
        <ListEditor
          {...list}
          itemLabel="فيديو"
          render={(v, patch) => <VideoItem v={v} patch={patch} kind={kind} />}
        />
      </Group>
    </div>
  );
}

function FilmsTab(props) {
  const { b } = makeBind(props.c, props.set);
  return (
    <VideoList {...props} path="portfolio.films" kind="film" title="الأفلام">
      <Group title="زرار 'شاهد المزيد'">
        <Field label="الرابط (سيبه فاضي لو مش عايز الزرار)" {...b("portfolio.filmsMore")} />
        <Field label="نص الزرار" {...b("portfolio.filmsMoreLabel")} />
      </Group>
    </VideoList>
  );
}

function ReelsTab(props) {
  return <VideoList {...props} path="portfolio.reels" kind="reel" title="الريلز" />;
}

/* ===================== باقي الأقسام ===================== */
function ExperienceTab({ c, set }) {
  const { b, l } = makeBind(c, set);
  return (
    <div className="grid gap-4">
      <Group title="عنوان القسم">
        <Field label="السطر الصغير" {...b("experience.label")} />
        <TitleFields parts={["العنوان"]} {...b("experience.title")} />
      </Group>
      <Group title="الكروت">
        <ListEditor
          {...l("experience.items")}
          itemLabel="كارت"
          addLabel="إضافة كارت"
          newItem={() => ({ icon: "heart", tag: "", title: "", text: "" })}
          render={(it, patch) => (
            <div className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <IconSelect label="الأيقونة" value={it.icon} onChange={(v) => patch({ icon: v })} />
                <Field label="التاج الصغير" value={it.tag} onChange={(v) => patch({ tag: v })} />
              </div>
              <Field label="العنوان" value={it.title} onChange={(v) => patch({ title: v })} />
              <Field label="الوصف" multiline value={it.text} onChange={(v) => patch({ text: v })} />
            </div>
          )}
        />
      </Group>
    </div>
  );
}

function PackagesTab({ c, set }) {
  const { b, l } = makeBind(c, set);
  return (
    <div className="grid gap-4">
      <Group title="عناوين القسم">
        <Field label="السطر الصغير" {...b("packages.label")} />
        <TitleFields
          parts={["العنوان - البداية", "الكلمة المميزة (ذهبي مائل)", "العنوان - النهاية"]}
          {...b("packages.title")}
        />
        <Field label="الوصف تحت العنوان" {...b("packages.sub")} />
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="كلمة 'from'" {...b("packages.from")} />
          <Field label="نص زرار الطلب" {...b("packages.cta")} />
          <Field label="شارة 'الأكثر طلباً'" {...b("packages.popular")} />
        </div>
        <Field
          label="رسالة واتساب عند طلب باكدج (استخدم {name} مكان اسم الباكدج)"
          multiline
          {...b("packages.requestMessage")}
        />
      </Group>

      <Group title="الباكدجات">
        <ListEditor
          {...l("packages.items")}
          itemLabel="باكدج"
          addLabel="إضافة باكدج"
          newItem={() => ({ tag: "", name: "", price: 0, featured: false, text: "", list: [] })}
          render={(k, patch) => (
            <div className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="التاج الصغير" value={k.tag} onChange={(v) => patch({ tag: v })} />
                <Field label="اسم الباكدج" value={k.name} onChange={(v) => patch({ name: v })} />
              </div>
              <div className="grid items-end gap-3 sm:grid-cols-2">
                <NumberField label="السعر باليورو (رقم بس)" value={k.price} onChange={(v) => patch({ price: v })} />
                <Toggle label="الأكثر طلباً (إبراز الكارت)" checked={k.featured} onChange={(v) => patch({ featured: v })} />
              </div>
              <Field label="الوصف" multiline value={k.text} onChange={(v) => patch({ text: v })} />
              <StringList
                label="المميزات"
                items={k.list}
                onChange={(v) => patch({ list: v })}
                addLabel="إضافة ميزة"
              />
            </div>
          )}
        />
      </Group>

      <Group title="الإضافة (Add-on)">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="التاج الصغير" {...b("packages.addon.tag")} />
          <Field label="الاسم" {...b("packages.addon.name")} />
        </div>
        <NumberField label="السعر باليورو (رقم بس)" {...b("packages.addon.price")} />
        <Field label="الوصف" multiline {...b("packages.addon.text")} />
      </Group>

      <Group title="الصندوق الأخير (باكدج مخصص)">
        <Field label="النص" {...b("packages.note.text")} />
        <Field label="نص اللينك" {...b("packages.note.link")} />
        <Field label="السطر الصغير" {...b("packages.note.small")} />
      </Group>
    </div>
  );
}

function TestimonialsTab({ c, set }) {
  const { b, l } = makeBind(c, set);
  return (
    <div className="grid gap-4">
      <Group title="عنوان القسم">
        <Field label="السطر الصغير" {...b("testimonials.label")} />
        <TitleFields parts={["العنوان - البداية", "الكلمة المميزة (ذهبي مائل)"]} {...b("testimonials.title")} />
        <p className="text-xs text-mute">لو مسحت كل التقييمات القسم كله بيختفي من الموقع.</p>
      </Group>
      <Group title="التقييمات">
        <ListEditor
          {...l("testimonials.items")}
          itemLabel="تقييم"
          addLabel="إضافة تقييم"
          newItem={() => ({ quote: "", name: "", date: "" })}
          render={(it, patch) => (
            <div className="grid gap-3">
              <Field label="الكلام" multiline rows={4} value={it.quote} onChange={(v) => patch({ quote: v })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="الاسم" value={it.name} onChange={(v) => patch({ name: v })} />
                <Field label="التاريخ (مثال: 28 JANUARY 2023)" value={it.date} onChange={(v) => patch({ date: v })} />
              </div>
            </div>
          )}
        />
      </Group>
    </div>
  );
}

function FaqTab({ c, set }) {
  const { b, l } = makeBind(c, set);
  return (
    <div className="grid gap-4">
      <Group title="عنوان القسم">
        <Field label="السطر الصغير" {...b("faq.label")} />
        <TitleFields parts={["العنوان - البداية", "الكلمة المميزة (ذهبي مائل)"]} {...b("faq.title")} />
      </Group>
      <Group title="الأسئلة">
        <ListEditor
          {...l("faq.items")}
          itemLabel="سؤال"
          addLabel="إضافة سؤال"
          newItem={() => ({ q: "", a: "" })}
          render={(it, patch) => (
            <div className="grid gap-3">
              <Field label="السؤال" value={it.q} onChange={(v) => patch({ q: v })} />
              <Field label="الإجابة" multiline value={it.a} onChange={(v) => patch({ a: v })} />
            </div>
          )}
        />
      </Group>
    </div>
  );
}

/* ===================== فورم التواصل ===================== */
function FieldConfig({ c, set, k, title, required = false, placeholder = false, toggle = true }) {
  const { b } = makeBind(c, set);
  const p = `inquiry.fields.${k}`;
  return (
    <div className="grid gap-3 rounded-2xl border border-line bg-cream/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold">{title}</span>
        <div className="flex flex-wrap gap-4">
          {toggle && <Toggle label="ظاهر في الفورم" {...{ checked: getIn(c, `${p}.enabled`), onChange: b(`${p}.enabled`).onChange }} />}
          {required && <Toggle label="إجباري" checked={getIn(c, `${p}.required`)} onChange={b(`${p}.required`).onChange} />}
        </div>
      </div>
      <Field label="العنوان فوق الخانة" {...b(`${p}.label`)} />
      {placeholder && <Field label="النص الإرشادي داخل الخانة" {...b(`${p}.placeholder`)} />}
    </div>
  );
}

function InquiryTab({ c, set }) {
  const { b } = makeBind(c, set);
  const fp = { c, set };
  return (
    <div className="grid gap-4">
      <p className="rounded-2xl border border-line bg-white p-4 text-xs leading-6 text-mute">
        أي حد يملا الفورم، رسالته بتوصل لتاب <b className="text-ink">الرسائل</b> هنا في الداشبورد. من هنا تتحكم في
        نصوص الفورم والخانات اللي تظهر فيه.
      </p>

      <Group title="عناوين القسم">
        <Field label="السطر الصغير" {...b("inquiry.label")} />
        <TitleFields parts={["العنوان - البداية", "الكلمة المميزة (ذهبي مائل)"]} {...b("inquiry.title")} />
        <Field label="الوصف" {...b("inquiry.sub")} />
        <Field label="عنوان 'تواصل مباشر'" {...b("inquiry.direct")} />
      </Group>

      <Group title="خطوات الفورم">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="اسم الخطوة 1" {...b("inquiry.steps.0")} />
          <Field label="اسم الخطوة 2" {...b("inquiry.steps.1")} />
          <Field label="اسم الخطوة 3" {...b("inquiry.steps.2")} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="كلمة STEP" {...b("inquiry.stepWord")} />
          <Field label="كلمة OF" {...b("inquiry.ofWord")} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="زرار الخطوة 1 ← 2" {...b("inquiry.nextButtons.0")} />
          <Field label="زرار الخطوة 2 ← 3" {...b("inquiry.nextButtons.1")} />
        </div>
      </Group>

      <Group title="الخانات">
        <p className="text-xs text-mute">الاسم دايماً ظاهر وإجباري. سيب الإيميل أو الهاتف ظاهر على الأقل عشان تقدر ترد على العميل.</p>
        <FieldConfig {...fp} k="date" title="تاريخ الفرح" required />
        <FieldConfig {...fp} k="venue" title="مكان الفرح" required placeholder />
        <FieldConfig {...fp} k="package" title="اختيار الباكدج" />
        <FieldConfig {...fp} k="social" title="خانة إضافة السوشيال ميديا" />
        <FieldConfig {...fp} k="name" title="الاسم" toggle={false} />
        <FieldConfig {...fp} k="email" title="الإيميل" required />
        <FieldConfig {...fp} k="phone" title="الهاتف" required />
        <FieldConfig {...fp} k="message" title="الرسالة" required />
        <Field label="خيار 'مش متأكد' في الباكدجات (سيبه فاضي لو مش عايزه)" {...b("inquiry.notSure")} />
      </Group>

      <Group title="الأزرار والرسائل">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="زرار الإرسال" {...b("inquiry.submit")} />
          <Field label="أثناء الإرسال" {...b("inquiry.sending")} />
          <Field label="زرار الرجوع" {...b("inquiry.back")} />
        </div>
        <Field label="عنوان رسالة الشكر (استخدم {name} مكان اسم العميل)" {...b("inquiry.successTitle")} />
        <Field label="نص رسالة الشكر" multiline {...b("inquiry.successText")} />
        <Field label="زرار واتساب بعد الإرسال (سيبه فاضي لو مش عايزه)" {...b("inquiry.waAfter")} />
        <Field label="زرار 'إرسال طلب تاني'" {...b("inquiry.again")} />
        <Field label="رسالة الخطأ" multiline {...b("inquiry.errorText")} />
      </Group>
    </div>
  );
}

/* ===================== بيانات الموقع ===================== */
function SiteTab({ c, set }) {
  const { b } = makeBind(c, set);
  return (
    <div className="grid gap-4">
      <Group title="بيانات التواصل">
        <Field label="الاسم" {...b("site.name")} />
        <ImageField label="اللوجو" fallback={D.site.logo} {...b("site.logo")} />
        <Field label="الإيميل" {...b("site.email")} />
        <Field label="رقم واتساب (بكود الدولة، مثال: +4917664484516)" {...b("site.whatsapp")} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="يوزر إنستجرام (مثال: @wisam_abraham)" {...b("site.instagramHandle")} />
          <Field label="رابط إنستجرام" {...b("site.instagramUrl")} />
        </div>
        <Field label="رسالة زرار واتساب العائم" {...b("site.chatMessage")} />
      </Group>
      <Group title="الفوتر">
        <Field label="السطر تحت الاسم" {...b("site.footerTag")} />
      </Group>
      <Group title="عنوان الموقع في جوجل">
        <Field label="العنوان (Title)" {...b("site.title")} />
        <Field label="الوصف (Description)" multiline {...b("site.description")} />
      </Group>
    </div>
  );
}

/* inputCls re-exported only to keep the import list honest */
void inputCls;

export const TABS = [
  { id: "hero", label: "الرئيسية", Comp: HeroTab },
  { id: "about", label: "نبذة عني", Comp: AboutTab },
  { id: "stats", label: "الأرقام والمميزات", Comp: StatsTab },
  { id: "portfolio", label: "عناوين البورتفوليو", Comp: PortfolioTab },
  { id: "photos", label: "الصور", Comp: PhotosTab },
  { id: "films", label: "الأفلام", Comp: FilmsTab },
  { id: "reels", label: "الريلز", Comp: ReelsTab },
  { id: "experience", label: "التجربة", Comp: ExperienceTab },
  { id: "packages", label: "الباكدجات", Comp: PackagesTab },
  { id: "testimonials", label: "التقييمات", Comp: TestimonialsTab },
  { id: "faq", label: "الأسئلة", Comp: FaqTab },
  { id: "inquiry", label: "فورم التواصل", Comp: InquiryTab },
  { id: "site", label: "بيانات الموقع", Comp: SiteTab },
  { id: "messages", label: "الرسائل", Comp: MessagesTab, noSave: true },
];
