import SearchEngine from "../search/SearchEngine";

declare module 'fastify' {
  interface FastifyInstance {
    searchEngine: SearchEngine
  }
}

// /src/type/index.d.ts
// declare module 'myModule' {
//   export namespace myNamespace {
//     type Foo = string;
//     interface Bar { baz: number; }
//   }
// }

//
// import { myNamespace } from 'myModule'
// const foo: myNamespace.Foo = 'foo'
