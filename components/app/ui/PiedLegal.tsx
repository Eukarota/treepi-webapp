import { useTranslations } from "next-intl";

/*
 * Mention légale du bas des écrans d'authentification (maquettes SignUp /
 * Login) : « En continuant, tu acceptes nos Conditions d'utilisation et
 * notre Politique de confidentialité. » Les liens pointent vers des ancres
 * en attendant les pages légales (TODO phase légale).
 */
export default function PiedLegal() {
  const t = useTranslations("app.commun");
  return (
    <p className="text-center text-[10px] leading-4 text-dark">
      {t("legalAvant")}
      <a href="#" className="text-primary-light hover:underline">
        {t("legalConditions")}
      </a>
      {t("legalEntre")}
      <a href="#" className="text-primary-light hover:underline">
        {t("legalPolitique")}
      </a>
      {t("legalApres")}
    </p>
  );
}
