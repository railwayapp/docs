<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
</head>
<style>body{
	padding-top:20px;
	max-width: 100%;
	margin: auto;
	font: bold 16px Arial;

}
table{
	text-align:left;
	border: 2px solid black;
	margin: auto;
	
	background-color:pink;
}
td
{
font: bold 16px Arial;
padding: 5px;
}
input[type=text],input[type=date],input[type=password],
input[type=email],select
{
	width:100%;
	font: 16px Arial;
	height:30px;
}
input[type=checkbox]
{
			width:  15px; 
            height: 15px; 
}

input[type=submit],input[type=reset]
{
	font: 16px Arial;
	height:30px;
}
</style>
<body>
<form name="Ejercicio6" method="post" action="Ejercicio6.php"> 
<table>
<tr><td colspan="2" align="center"><h2>Datos de usuario</h2></td></tr>
<tr><td>Nick de usuario: </td><td><input type="text" name="nick"></td></tr>
<tr><td>Correo: </td><td><input type="email" name="correo"></td></tr>
<tr><td>Contraseña: </td><td><input type="password" name="pass"></td></tr>
<tr><td>Pais: </td>
<td>
<select name="pais">
<option value="Perú">Perú</option>
<option value="Chile">Chile</option>
<option value="Argentina">Argentina</option>
<option value="Ecuador">Ecuador</option>
<option value="Italia">Italia</option>
<option value="Brasil">Brasil</option>
<option value="Grecia">Grecia</option>
<option value="Uruguay">Uruguay</option>
</select>
</td></tr>
<tr><td>Fecha de nacimiento: </td><td><input type="date" name="fecha"/></td></tr>
<tr><td colspan="2"><input type="checkbox" name="check1" >Recibir noticias </td></tr>
<tr><td colspan="2"><input type="checkbox" name="check2" >Recibir promociones </td></tr>
<tr><td colspan="2"><input type="checkbox" name="check3" >Aceptar las Condiciones y la política de cookies</td></tr>
<tr><td align="right"><input type="submit" value="Registrar" name="registrar"></td><td><input type="reset" name="cancelar" value="Cancelar"></td></tr>
<td><input type="edit" name="Editar" value="Editar"></td></tr>
</table>
</form>
</table>
</body>
</html>



## Understanding Config Source

On a service's deployment details page, all the settings that a deployment went out with are shown.

For settings that come from a configuration file, there is a file icon. Hovering over the icon will show exactly what part of the file the values originated from.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1666388941/docs/details-page-config-tooltip_jvy1qu.png"
alt="Screenshot of Deployment Details Pane"
layout="responsive"
width={948} height={419} quality={100} />


## Using a Custom Config as Code File

You can use a custom config file by setting it on the service settings page. The file is relative to your app source.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1666387423/docs/config-file-path_xvq4xj.png"
alt="Screenshot of Rollback Menu"
layout="responsive"
width={621} height={204} quality={100} />

## Configurable Settings

Find a list of all of the configurable settings in the [config as code reference page](/reference/config-as-code#configurable-settings).
