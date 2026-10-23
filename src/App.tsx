/**
 * ParsiKit Official Website & Documentation Hub
 * Project Owner & Creator: Ali Kamrani (MRThugh)
 * Official Repo: https://github.com/MRThugh/ParsiKit
 */

import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PillarsSection } from './components/PillarsSection';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';
import { Accordion } from './components/ui/Accordion';
import { Button } from './components/ui/Button';
import { HelpCircle, Loader2 } from 'lucide-react';

// Lazy-loaded route views for code splitting
const InteractivePlayground = lazy(() =>
  import('./components/InteractivePlayground').then((m) => ({ default: m.InteractivePlayground }))
);
const DocumentationView = lazy(() =>
  import('./components/DocumentationView').then((m) => ({ default: m.DocumentationView }))
);
const ArchitectureView = lazy(() =>
  import('./components/ArchitectureView').then((m) => ({ default: m.ArchitectureView }))
);
const ChangelogView = lazy(() =>
  import('./components/ChangelogView').then((m) => ({ default: m.ChangelogView }))
);

function ViewLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] text-stone-400">
      <Loader2 className="w-8 h-8 animate-spin text-[#126E68] dark:text-[#52C5BE]" />
    </div>
  );
}

function MainContent() {
  const { route, lang, navigateToDoc } = useApp();
  const isRtl = lang === 'fa';
  const isEs = lang === 'es';

  const faqItems = [
    {
      title: isRtl
        ? 'چرا به جای متدهای پیش‌فرض پایتون یا Regex از پارسی‌کیت استفاده کنیم؟'
        : isEs
        ? '¿Por qué usar ParsiKit en lugar de métodos nativos de Python o expresiones regulares?'
        : 'Why use ParsiKit instead of standard Python string methods or regex?',
      content: isRtl
        ? 'متدهای استاندارد پایتون در تشخیص نیم‌فاصله‌ها، اصلاح کاراکترهای عربی «ي» و «ك» در جستجوهای دیتابیس، محاسبات سال کبیسه نجومی خورشیدی و تراز بصری متن‌ها در ترمینال دچار خطا می‌شوند. پارسی‌کیت یک موتور جامع و خالص پایتونی بدون هیچ وابستگی جانبی برای رفع تمام این چالش‌ها ارائه می‌دهد.'
        : isEs
        ? 'Las expresiones regulares estándar y los métodos de cadenas fallan al detectar el espacio de no separación de ancho cero (ZWNJ), confunden variantes árabes en búsquedas de base de datos y no calculan con precisión el ciclo bisiesto persa de 33 años. ParsiKit proporciona motores especializados en Python puro sin dependencias para resolver estos problemas.'
        : 'Standard regex and string methods in Python fail on Zero-Width Non-Joiners (ZWNJ, \\u200C), misidentify Arabic Yeh/Kaf variations in database searches, cannot handle astronomical Solar Hijri leap calculations, and misalign visual string widths in CLI formats. ParsiKit provides pure-Python, zero-dependency domain engines tailored specifically to the Persian language and Iranian domestic data standards.',
    },
    {
      title: isRtl
        ? 'آیا پارسی‌کیت به وب‌سرویس ثبت احوال یا سیستم استعلام موجودی بانک‌ها متصل است؟'
        : isEs
        ? '¿ParsiKit consulta registros gubernamentales o bases de datos bancarias en tiempo real?'
        : 'Does ParsiKit verify identity with government civil registries or check bank account balances?',
      content: isRtl
        ? 'خیر. پارسی‌کیت الگوریتم‌های ریاضی چک‌سام (مبنای ۱۱ ثبت‌احوال، الگوریتم لان کارت بانکی و استاندارد ایزو ۷۰۶۴ شبا) را به صورت محلی و بسیار سریع بررسی می‌کند. این کتابخانه به وب‌سرویس‌های آنلاین ثبت‌احوال یا بانک‌ها متصل نیست.'
        : isEs
        ? 'No. ParsiKit evalúa algoritmos matemáticos de checksum (Módulo 11 para Código Nacional, Luhn para tarjetas y estándar ISO 7064 para IBAN Sheba) de manera local, sin requerir acceso de red ni credenciales bancarias.'
        : 'No. ParsiKit evaluates mathematical checksum algorithms (Modulo 11 for National Codes, Luhn Mod 10 for Bank Cards, ISO 7064 for Sheba IBANs) and verifies structural syntax and prefix identities offline. It does not perform privileged network requests against private governmental or banking databases.',
    },
    {
      title: isRtl
        ? 'آیا پارسی‌کیت با FastAPI، Django و Pydantic نسخه ۲ سازگار است؟'
        : isEs
        ? '¿Es compatible ParsiKit con FastAPI, Django y Pydantic v2?'
        : 'Is ParsiKit compatible with FastAPI, Django, and Pydantic v2?',
      content: isRtl
        ? 'بله کاملاً! مدل‌های شیءگرای parsikit.models برای اعتبارسنجی خودکار، تولید داده‌های ماسک‌شده و ادغام در اسکیماهای Pydantic v2 و فرم‌های جنگو طراحی شده‌اند.'
        : isEs
        ? '¡Sí, totalmente! Los modelos de dominio en parsikit.models proporcionan ganchos de validación e interfaces de serialización compatibles con esquemas de Pydantic v2 y limpiadores de formularios en Django.'
        : 'Yes! ParsiKit domain models in parsikit.models provide custom validator hooks and native serialize/deserialize patterns fully compatible with Pydantic v2 schemas and Django form cleaners.',
    },
    {
      title: isRtl
        ? 'پیش‌نیازها و وابستگی‌های سیستمی پارسی‌کیت چیست؟'
        : isEs
        ? '¿Cuáles son los requisitos y dependencias del sistema?'
        : 'What are the system requirements and dependencies?',
      content: isRtl
        ? 'پارسی‌کیت به پایتون نسخه ۳.۱۰ یا بالاتر نیاز دارد و کاملاً صفر وابستگی (Zero Dependencies) است. این ویژگی باعث می‌شود روی هر سرور، کانتینر داکر یا سیستم بدون اینترنت به سرعت نصب و اجرا شود.'
        : isEs
        ? 'ParsiKit requiere Python 3.10+ y tiene CERO dependencias externas de tiempo de ejecución. Esto permite desplegarlo de forma instantánea en contenedores Docker mínimos, AWS Lambda, Google Cloud Run o entornos aislados sin conexión a internet.'
        : 'ParsiKit requires Python 3.10+ (tested on Python 3.10, 3.11, 3.12, and 3.13). It has ZERO external runtime dependencies, ensuring zero-configuration deployment across Docker containers, AWS Lambda, Google Cloud Run, and offline server environments.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <SearchModal />

      <main className="flex-1">
        {route === 'home' && (
          <>
            <Hero />
            <PillarsSection />
            <Suspense fallback={<ViewLoader />}>
              <InteractivePlayground />
            </Suspense>

            {/* Quickstart Callout Spotlight */}
            <section className="py-16 md:py-24 border-t border-stone-200/80 dark:border-white/10 bg-[#FAF7F2] dark:bg-[#0D1312]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#126E68] to-[#1D3D63] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 max-w-2xl">
                    <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold block mb-2">
                      {isRtl ? 'آماده برای توسعه و سرورهای پروداکشن' : isEs ? 'Listo para Producción' : 'Ready for Production'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                      {isRtl
                        ? 'شروع کار با پارسی‌کیت در کمتر از ۵ دقیقه'
                        : isEs
                        ? 'Comienza con ParsiKit en menos de 5 minutos'
                        : 'Get Started with ParsiKit in under 5 minutes'}
                    </h2>
                    <p className="text-sm sm:text-base text-stone-200 leading-relaxed mb-8">
                      {isRtl
                        ? 'راهنمای گام‌به‌گام را بخوانید، مثال‌های واقعی را در پروژه‌تان کپی کنید و نرم‌افزارهای استاندارد بسازید.'
                        : isEs
                        ? 'Explora la guía de inicio rápido con fragmentos listos para producción en FastAPI, Django o scripts de limpieza de datos.'
                        : 'Explore the full quickstart guide with production-ready snippets for FastAPI, Django, or data cleaning scripts.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigateToDoc('quickstart')}
                        className="bg-white text-[#126E68] hover:bg-stone-100 font-bold"
                      >
                        {isRtl ? 'مطالعه راهنمای شروع سریع' : isEs ? 'Leer Guía de Inicio Rápido' : 'Read Quickstart Guide'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => navigateToDoc('installation')}
                        className="bg-white/15 hover:bg-white/20 text-white font-medium border-white/20"
                      >
                        {isRtl ? 'دستورالعمل‌های نصب' : isEs ? 'Opciones de Instalación' : 'Installation Options'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Accordion Section */}
            <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#126E68] dark:text-[#52C5BE] uppercase tracking-wider mb-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>{isRtl ? 'پرسش‌های متداول' : isEs ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
                  {isRtl ? 'سوالات پرتکرار توسعه‌دهندگان' : isEs ? 'Preguntas y Respuestas Habituales' : 'Common Questions & Answers'}
                </h2>
              </div>

              <Accordion items={faqItems} defaultOpenIndex={0} />
            </section>
          </>
        )}

        <Suspense fallback={<ViewLoader />}>
          {route === 'playground' && <InteractivePlayground />}
          {route === 'docs' && <DocumentationView />}
          {route === 'architecture' && <ArchitectureView />}
          {route === 'changelog' && <ChangelogView />}
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
