import { promises as fsPromises} from "fs"
import validator from "fastest-validator"
const { readFile}= fsPromises

let _schema
async function schema(){
	if( _schema){
		return _schema
	}
	let file= await readFile(new URL('./find-window-exposed.fast.json', import.meta.url))
	file= JSON.parse( file)

	const v= new validator()
	_schema= v.compile( file)
	return _schema
}

export async function findWindowExposed( ctx){
	let check = await schema()
	const exposed= ctx.exposed= {}
	for( const i in ctx.idl){
		const value= ctx.idl[ i]
		const v= check( value)
		if( v!== true){
			continue
		}

		exposed[ value.name]= value
	}
	
}
export default findWindowExposed
