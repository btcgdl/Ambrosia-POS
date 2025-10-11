import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Translate from "@docusaurus/Translate";
import {
  ShoppingCart,
  CreditCard,
  BarChart3,
  Users,
  Smartphone,
  Shield,
  Clock,
  TrendingUp,
  Check,
  Star,
  Zap,
  Globe,
  Code,
  Download,
  Github,
  Bitcoin,
} from "lucide-react";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container text--center">
        <div className={styles.heroLogo}>
          <Bitcoin size={64} className={styles.bitcoinIcon} />
          <Zap size={48} className={styles.lightningIcon} />
        </div>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div>
          <p>
            <Translate id="homepage.hero.subtitle">Sistema POS de código abierto que acepta Bitcoin y Lightning Network</Translate>
          </p>
        </div>
        {<div>
          <Link
            className="button button--secondary button--lg margin-right--md"
            to="/blog"
          >
            <Download className="margin-right--sm" />
            <Translate id="homepage.getStarted">Comenzar Ahora</Translate>
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="https://github.com/btcgdl/Ambrosia-POS"
          >
            <Github className="margin-right--sm" />
            <Translate id="homepage.viewOnGithub">Ver en GitHub</Translate>
          </Link>
        </div> }
      </div>
    </header>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <Bitcoin size={32} className="text--warning" />,
      title: <Translate id="feature.bitcoinPayments">Pagos en Bitcoin</Translate>,
      description:
        <Translate id="feature.bitcoinPayments.description">
          "Acepta pagos directos en Bitcoin con confirmaciones en tiempo real y gestión automática de direcciones."
        </Translate>,
    },
    {
      icon: <Zap size={32} className="text--info" />,
      title: <Translate id="feature.lightningNetwork.title">Red Lightning</Translate>,
      description: 
        <Translate id="feature.lightningNetwork.description">
          "Pagos instantáneos y de bajo costo a través de Red Lightning para micropagos y transacciones rápidas."
        </Translate>,
    },
    {
      icon: <Code size={32} className="text--success" />,
      title: <Translate id="feature.openSource.title">Código Abierto</Translate>,
      description:
        <Translate id="feature.openSource.description">
          "Totalmente open source, auditable y personalizable según las necesidades de tu negocio."
        </Translate>,
    },
    {
      icon: <Shield size={32} className="text--danger" />,
      title: <Translate id="feature.selfCustody.title">Auto-Custodia</Translate>,
      description:
        <Translate id="feature.selfCustody.description">
          "Mantén el control total de tus fondos sin depender de terceros o intermediarios."
        </Translate>,
    },
    {
      icon: <Globe size={32} className="text--primary" />,
      title: <Translate id="feature.borderless.title">Sin Fronteras</Translate>,
      description:
        <Translate id="feature.borderless.description">
          "Acepta pagos de cualquier parte del mundo sin restricciones geográficas o bancarias."
        </Translate>,
    },
    {
      icon: <BarChart3 size={32} className="text--secondary" />,
      title: <Translate id="feature.advancedAnalytics.title">Analytics Avanzados</Translate>,
      description:
        <Translate id="feature.advancedAnalytics.description">
          "Reportes detallados de ventas, conversiones BTC/fiat y análisis de tendencias de mercado."
        </Translate>,
    },
  ];

  return (
    <section className="padding--lg">
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <h2>
            <Translate id="feature.bitcoinPOS.title">¿Por qué elegir nuestro POS Bitcoin?</Translate>
          </h2>
          <p className="text--muted">
            <Translate id="feature.bitcoinPOS.description">La próxima generación de sistemas de punto de venta construida sobre Bitcoin</Translate>
          </p>
        </div>
        <div className="row">
          {features.map((feature, idx) => (
            <div key={idx} className="col col--4 margin-bottom--lg">
              <div
                className={clsx(
                  "card shadow--md padding--lg text--center",
                  styles.featureCard,
                )}
              >
                <div className="margin-bottom--md">{feature.icon}</div>
                <h3 className="margin-bottom--sm">{feature.title}</h3>
                <p className="text--muted">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const benefits = [
    <Translate id="benefit.lowFees">Comisiones ultra bajas comparado con procesadores tradicionales</Translate>,
    <Translate id="benefit.instantSettlement">Liquidación instantánea con Lightning Network</Translate>,
    <Translate id="benefit.noChargebacks">Sin chargebacks ni disputas fraudulentas</Translate>,
    <Translate id="benefit.globalAccess">Acceso a mercados globales sin restricciones</Translate>,
    <Translate id="benefit.fullTransparency">Transparencia total con blockchain público</Translate>,
    <Translate id="benefit.censorshipResistance">Resistente a censura y control gubernamental</Translate>,
    <Translate id="benefit.walletIntegration">Integración con wallets populares (Electrum, Phoenix, etc.)</Translate>,
    <Translate id="benefit.multipleFiatSupport">Soporte para múltiples monedas fiat para conversión</Translate>,
  ];

  return (
    <section className="padding--lg bg--light">
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <h2 className="margin-bottom--lg">Ventajas de Ambrosia-POS</h2>
            <div className={styles.benefitsList}>
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className={clsx("margin-bottom--md", styles.benefitItem)}
                >
                  <Check className="text--success margin-right--sm" size={20} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col col--6">
            <div className={styles.statsContainer}>
              <div className={styles.statCard}>
                <h3 className="text--primary">~0.1%</h3>
                <p><Translate id="stat.averageFees">Comisiones promedio</Translate></p>
              </div>
              <div className={styles.statCard}>
                <h3 className="text--success">{"~1s"}</h3>
                <p><Translate id="stat.lightningConfirmation">Tiempo de confirmación Lightning</Translate></p>
              </div>
              <div className={styles.statCard}>
                <h3 className="text--warning">24/7</h3>
                <p><Translate id="stat.globalAvailability">Disponibilidad global</Translate></p>
              </div>
              <div className={styles.statCard}>
                <h3 className="text--info">100%</h3>
                <p><Translate id="stat.openSource">Código abierto</Translate></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Carlos Mendoza",
      business: "Café Bitcoin México",
      rating: 5,
      comment:
        "Implementamos este POS y ahora el 40% de nuestros pagos son en Bitcoin. Los clientes aman la rapidez de Lightning.",
    },
    {
      name: "Sarah Johnson",
      business: "Tech Store Miami",
      rating: 5,
      comment:
        "Como negocio tech, era natural aceptar Bitcoin. Este POS hizo la transición súper fácil y segura.",
    },
    {
      name: "Miguel Torres",
      business: "Librería El Salvador",
      rating: 5,
      comment:
        "Perfecto para nuestro país donde Bitcoin es moneda legal. Fácil de usar y muy confiable.",
    },
  ];

  return (
    <section className="padding--lg">
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <h2>Lo que dicen nuestros usuarios</h2>
          <p className="text--muted">
            Comerciantes de todo el mundo ya están usando Bitcoin POS
          </p>
        </div>
        <div className="row">
          {testimonials.map((t, idx) => (
            <div key={idx} className="col col--4 margin-bottom--lg">
              <div
                className={clsx(
                  "card padding--lg shadow--md",
                  styles.testimonialCard,
                )}
              >
                <div className="margin-bottom--sm">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="text--warning"
                      size={16}
                      fill="currentColor"
                    />
                  ))}
                </div>
                <p className="margin-bottom--md">"{t.comment}"</p>
                <div className={styles.testimonialAuthor}>
                  <strong>{t.name}</strong>
                  <br />
                  <em className="text--muted">{t.business}</em>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStackSection() {
  const technologies = [
    {
      name: "Ktor",
      description: <Translate id="theme.techStack.ktor">Framework backend para Kotlin</Translate>,
    },
    {
      name: "Lightning Network",
      description: <Translate id="theme.techStack.lightningNetwork">Pagos instantáneos y de bajo costo</Translate>,
    },
    {
      name: "React/Electron",
      description: <Translate id="theme.techStack.reactElectron">Interfaz moderna y multiplataforma</Translate>,
    },
    { name: "Kotlin", description: <Translate id="theme.techStack.kotlin">Backend robusto y escalable</Translate> },
    { name: "SQLite", description: <Translate id="theme.techStack.sqlite">Base de datos local</Translate> },
    {
      name: "REST API",
      description: <Translate id="theme.techStack.restApi">Integración sencilla con otros servicios</Translate>,
    },
  ];

  return (
    <section className="padding--lg bg--light">
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <h2><Translate id="theme.techStack.title">Stack Tecnológico</Translate></h2>
          <p className="text--muted">
            <Translate id="theme.techStack.description">
              Construido con las mejores tecnologías Bitcoin y web modernas
            </Translate>
          </p>
        </div>
        <div className="row">
          {technologies.map((tech, idx) => (
            <div key={idx} className="col col--4 margin-bottom--md">
              <div className={styles.techItem}>
                <h4 className="margin-bottom--sm">{tech.name}</h4>
                <p className="text--muted text--small">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={clsx("padding--lg text--center", styles.ctaSection)}>
      <div className="container">
        <h2 className="margin-bottom--md text--white">
          ¿Listo para aceptar Bitcoin en tu negocio?
        </h2>
        <p className="margin-bottom--lg text--white opacity-90">
          Únete a la revolución financiera y comienza a aceptar la moneda del
          futuro hoy mismo.
        </p>
        <div className="button-group">
          <Link
            className="button button--secondary button--lg margin-right--sm"
            to="/docs/installation"
          >
            <Download className="margin-right--sm" />
            Descargar Gratis
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/docs/demo"
            style={{ borderColor: "white", color: "white" }}
          >
            Ver Demo en Vivo
          </Link>
        </div>
        <div className="margin-top--lg">
          <p className="text--white opacity-75 text--small">
            <Check className="margin-right--sm" size={16} />
            100% Gratis y Open Source
            <span className="margin-left--lg margin-right--lg">•</span>
            <Check className="margin-right--sm" size={16} />
            Sin límites de transacciones
            <span className="margin-left--lg margin-right--lg">•</span>
            <Check className="margin-right--sm" size={16} />
            Soporte de la comunidad
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - POS Bitcoin Open Source`}
      description="Sistema de punto de venta open source que acepta Bitcoin y Lightning Network. Gratis, seguro y sin comisiones."
    >
      <HomepageHeader />
      <main>
        <FeaturesSection />
        <BenefitsSection />
        {/* <TestimonialsSection /> */}
        <TechStackSection />
        {/* <CTASection /> */}
      </main>
    </Layout>
  );
}
