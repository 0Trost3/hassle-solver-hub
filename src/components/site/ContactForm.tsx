import { useState, type FormEvent, type ReactNode } from "react";
import { Mail, Send } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Bitte gib deinen Namen ein.").max(100),
  email: z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse ein.").max(255),
  phone: z.string().trim().max(40),
  provider: z.string().trim().max(150),
  message: z.string().trim().min(20, "Bitte beschreibe dein Anliegen in mindestens 20 Zeichen.").max(3000),
});

type ContactField = keyof z.infer<typeof contactSchema>;

const initialValues = { name: "", email: "", phone: "", provider: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});

  function update(field: ContactField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = contactSchema.safeParse(values);

    if (!parsed.success) {
      const nextErrors: Partial<Record<ContactField, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !(field in nextErrors)) {
          nextErrors[field as ContactField] = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    const { name, email, phone, provider, message } = parsed.data;
    const body = [
      `Name: ${name}`,
      `E-Mail: ${email}`,
      phone ? `Telefon: ${phone}` : "",
      provider ? `Dienstleister: ${provider}` : "",
      "",
      "Mein Anliegen:",
      message,
    ]
      .filter((line) => line !== "")
      .join("\n");

    window.location.href = `mailto:ylt.servicesdortmund@gmail.com?subject=${encodeURIComponent(`Anfrage von ${name}`)}&body=${encodeURIComponent(body)}`;
  }

  const fieldClass =
    "mt-1.5 min-h-12 w-full rounded-lg bg-surface px-3.5 text-[15px] text-foreground ring-1 ring-border outline-none transition focus:ring-2 focus:ring-primary placeholder:text-foreground/30";

  return (
    <form onSubmit={submit} noValidate className="mt-6 grid gap-4" aria-label="Kontaktformular">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name} required>
          <input
            className={fieldClass}
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            autoComplete="name"
            maxLength={100}
          />
        </Field>
        <Field label="E-Mail-Adresse" error={errors.email} required>
          <input
            className={fieldClass}
            type="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            autoComplete="email"
            maxLength={255}
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Telefon (optional)" error={errors.phone}>
          <input
            className={fieldClass}
            type="tel"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            autoComplete="tel"
            maxLength={40}
          />
        </Field>
        <Field label="Dienstleister (optional)" error={errors.provider}>
          <input
            className={fieldClass}
            value={values.provider}
            onChange={(event) => update("provider", event.target.value)}
            maxLength={150}
          />
        </Field>
      </div>
      <Field label="Worum geht es?" error={errors.message} required>
        <textarea
          className={`${fieldClass} min-h-36 resize-y py-3`}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          maxLength={3000}
          placeholder="Beschreibe kurz, was vereinbart war und wo die Kommunikation feststeckt."
        />
      </Field>
      <Button type="submit" size="lg" className="min-h-13 w-full rounded-lg text-[15px] sm:w-auto sm:justify-self-start">
        <Send aria-hidden="true" /> E-Mail vorbereiten
      </Button>
      <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-foreground/45">
        <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Dein E-Mail-Programm öffnet einen Entwurf. Prüfe ihn dort und sende ihn anschließend selbst ab.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  required = false,
  children,
}: {
  label: string;
  error?: string | undefined;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block text-[13px] font-medium text-foreground/70">
      {label} {required && <span className="text-primary">*</span>}
      {children}
      {error && <span className="mt-1.5 block text-[12px] text-destructive">{error}</span>}
    </label>
  );
}