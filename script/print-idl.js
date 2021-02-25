#!/usr/bin/env node
"use module"
import { argv } from "process"
import { readFile } from "fs/promises"
import { parse } from "webidl2"
import esMain from "es-main"

export async function printIdl(file= argv && argv[2]) {
	const text = await readFile(file, "utf8")
	const idl = parse(file)
	return idl
}

if (esMain(import.meta)) {
	const text = printIdl()
	console.log(JSON.stringify(text, null, "\t"))
}

export default printIdl
