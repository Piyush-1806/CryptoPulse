declare module 'plantuml-encoder' {
  /**
   * Encodes a PlantUML diagram into a compressed string for URLs
   * @param puml The PlantUML diagram code
   * @returns The encoded string
   */
  export function encode(puml: string): string;

  /**
   * Decodes a compressed PlantUML string back to the original code
   * @param encoded The encoded PlantUML string
   * @returns The original PlantUML diagram code
   */
  export function decode(encoded: string): string;

  export default {
    encode,
    decode
  };
}