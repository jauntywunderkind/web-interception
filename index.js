#!/usr/bin/env node
import arrify from "arrify"
import esMain from "es-main"
import { promises as fsPromises} from "fs"
import { dirname, join} from "path"
import { argv} from "process"
import { loadIdls} from "./helper/load-idl.js"
const { readdir}= fsPromises

export async function runSteps( files, steps= findAllSteps()){
	const idl= await loadIdls( files)
	const ctx= { idl}
	for( let step of await steps){
		await step( ctx)
	}
	return ctx
}
export default runSteps

export async function findAllSteps(){
	const base= dirname( import.meta.url).replace(/^file:/, "")
	const stepDir= join( base, "step")

	let stepFiles = await readdir( join( base, "step"))
	stepFiles= stepFiles.filter( f=> f.endsWith(".js"))
	for( const i in stepFiles){
		stepFiles[ i]= import( join( stepDir, stepFiles[ i]))
	}

	const resolved= await Promise.all( stepFiles)
	for( const i in resolved){
		resolved[ i]= resolved[ i].default
	}
	return resolved
}

export async function main( args= argv.slice(2)) {
	const out= await runSteps( args)
	console.log( JSON.stringify( out, null, "\t"))
}

if (esMain( import.meta)) {
	main()
}
