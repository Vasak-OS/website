import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { YAML } from "bun";

/*
  El índice del blog tiene que salir por fecha, la más nueva primero. El orden
  por defecto de Hugo es «weight ascendente y después fecha descendente», con
  los que no tienen weight al final: un solo post con `weight` salta arriba del
  listado por encima de posts más nuevos. Y no se arregla desde la plantilla:
  `head.html` pide `.Paginator` para los rel prev/next, antes de que se
  renderice el cuerpo, y esa colección queda fijada con el orden por defecto.
  Por eso la regla es sobre el contenido: ningún post del blog lleva `weight`.
*/

function posts(dir: string): string[] {
  const salida: string[] = [];
  for (const nombre of readdirSync(dir)) {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) salida.push(...posts(ruta));
    else if (nombre.endsWith(".md") && !nombre.startsWith("_index"))
      salida.push(ruta);
  }
  return salida;
}

describe("orden del índice del blog", () => {
  test("ningún post del blog define weight, para que el índice salga por fecha", () => {
    const conWeight = posts("content/blog").filter((ruta) => {
      const m = readFileSync(ruta, "utf8").match(/^---\n([\s\S]*?)\n---/);
      if (!m) return false;
      const fm = (YAML.parse(m[1]) ?? {}) as Record<string, unknown>;
      return "weight" in fm;
    });
    expect(conWeight).toEqual([]);
  });
});
