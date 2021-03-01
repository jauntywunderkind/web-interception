#!/usr/bin/env node
import arrify from "arrify"
import {argv } from "process"
import {promises } from "fs"
import webidl2 from "webidl2"
import esMain from "es-main"
const parse= webidl2.parse
const readFile= promises.readFile

/**
* Load idl from a file
*/
export async function loadIdl( filename= argv && argv[ 2]) {
	const text = await readFile( filename, "utf8")
	const idl = parse( text)
	return idl
}
export default loadIdl

/**
* Load and merge together idl files
*/
export async function loadIdls( filenames= argv){
	filenames= arrify( filenames)
	let idls= filenames.map( loadIdl)
	idls= await Promise.all( idls)
	return [].concat(...idls)
}

export async function main( args= argv.slice(2)){
	const text = await loadIdls(args)
	console.log( JSON.stringify( text, null, "\t"))
}

if (esMain( import.meta)) {
	main()
}
