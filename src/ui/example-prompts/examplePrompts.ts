/**
 * Catalogue of example prompts grouped by difficulty level.
 * Based on the cabinet_rdv database schema (appointments, patients, employees,
 * invoices, treatments, rooms, equipment, competitors).
 */

/** Chart / output type produced by this prompt. */
export type OutputType = "bar" | "line" | "pie" | "area" | "scatter" | "mermaid" | "table";

/** One example prompt entry. */
export interface ExamplePrompt {
  /** Short display label shown in the popover list. */
  label: string;
  /** Full prompt text submitted to the AI. */
  prompt: string;
  /** Expected output type — used to preview the chart style. */
  outputType: OutputType;
}

/** A group of prompts sharing the same difficulty level. */
export interface ExampleGroup {
  level: "Facile" | "Intermédiaire" | "Complexe";
  color: "success" | "warning" | "error";
  items: ExamplePrompt[];
}

/** All prompt groups ordered from easy to complex. */
export const EXAMPLE_GROUPS: ExampleGroup[] = [
  {
    level: "Facile",
    color: "success",
    items: [
      { label: "RDV par statut", outputType: "bar", prompt: "Nombre de rendez-vous par statut (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED) en graphique en barres" },
      { label: "Types d'employés", outputType: "pie", prompt: "Répartition des types d'employés (dentiste, hygiéniste, assistant, réception) en graphique circulaire" },
      { label: "Top 10 traitements", outputType: "bar", prompt: "Top 10 des traitements les plus demandés cette année en graphique en barres" },
      { label: "Nouveaux patients / mois", outputType: "line", prompt: "Évolution du nombre de nouveaux patients inscrits par mois cette année en graphique de courbe" },
      { label: "RDV par employé", outputType: "bar", prompt: "Nombre de rendez-vous pris en charge par chaque employé ce mois-ci en graphique en barres" },
      { label: "Équipements par catégorie", outputType: "pie", prompt: "Répartition du nombre d'équipements par catégorie en graphique circulaire" },
      { label: "Tarifs des traitements", outputType: "bar", prompt: "Tarif standard de chaque traitement du moins cher au plus cher en graphique en barres horizontal" },
    ],
  },
  {
    level: "Intermédiaire",
    color: "warning",
    items: [
      { label: "CA mensuel 12 mois", outputType: "line", prompt: "Chiffre d'affaires mensuel sur les 12 derniers mois en graphique de courbe" },
      { label: "Taux d'annulation / traitement", outputType: "bar", prompt: "Taux d'annulation des rendez-vous par type de traitement en barres, trié par taux décroissant" },
      { label: "Revenus par dentiste", outputType: "bar", prompt: "Revenus générés par chaque dentiste sur le trimestre en cours en barres empilées par type de traitement" },
      { label: "Nos tarifs vs concurrents", outputType: "bar", prompt: "Compare nos tarifs vs la moyenne des concurrents pour les 5 traitements les plus courants en barres côte à côte" },
      { label: "Occupation des salles", outputType: "bar", prompt: "Nombre de rendez-vous par salle et par jour de la semaine en barres groupées" },
      { label: "CA par catégorie (donut)", outputType: "pie", prompt: "Répartition du chiffre d'affaires total par catégorie de traitement en donut chart" },
      { label: "Durée prévue vs réelle", outputType: "bar", prompt: "Durée moyenne des rendez-vous par type de traitement comparée à la durée standard prévue en graphique en barres côte à côte" },
    ],
  },
  {
    level: "Complexe",
    color: "error",
    items: [
      { label: "Cycle de vie RDV (Mermaid)", outputType: "mermaid", prompt: "Génère un diagramme Mermaid stateDiagram-v2 du cycle de vie d'un rendez-vous avec tous les états : PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED" },
      { label: "ERD facturation (Mermaid)", outputType: "mermaid", prompt: "Crée un diagramme entité-relation Mermaid erDiagram des tables de facturation : invoice, invoice_line, payment et patient avec leurs clés étrangères" },
      { label: "Séquence prise de RDV (Mermaid)", outputType: "mermaid", prompt: "Génère un diagramme sequenceDiagram Mermaid du processus complet de prise de rendez-vous : patient, réceptionniste, dentiste et salle" },
      { label: "Analyse traitement × âge", outputType: "bar", prompt: "Analyse croisée traitement × tranche d'âge du patient (0-18, 19-40, 41-60, 61+) : nombre de RDV et revenu moyen par cellule en barres groupées" },
      { label: "Prix vs concurrents 6 mois", outputType: "line", prompt: "Évolution de nos prix vs la moyenne des concurrents sur les 6 derniers mois par catégorie de traitement en graphique multi-courbes" },
      { label: "Relations équipements (Mermaid)", outputType: "mermaid", prompt: "Génère un diagramme Mermaid erDiagram des relations entre équipements, salles et traitements via les tables room_equipment, treatment_equipment et appointment_equipment" },
      { label: "Dashboard semaine", outputType: "table", prompt: "Dashboard complet de la semaine : RDV par statut + CA quotidien vs semaine précédente + top 3 traitements réalisés, en graphiques côte à côte" },
    ],
  },
];
