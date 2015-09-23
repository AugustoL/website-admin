var strings = {
	"en": {
		"language" : "en",
		"readMore" : "Read more",
		"posted" : "Posted on",
		"in" : "in",
		"drafts" : "Drafts",
		"posts" : "Posts",
		"uploadImages" : "Upload Images",
		"images" : " Images",
		"newPost" : " New Post",
		"date" : "Date",
		"title" : "Title",
		"publish" : "Publish",
		"edit" : "Edit",
		"toDrafts" : "To Drafts",
		"delete" : "Delete",
		"upload" : "Upload",
		"selectOrDrag" : "Select or drag images",
		"changeName" : "Change Name",
		"editPost" : "Edit Post",
		"submit" : "Submit",
		"shortPreview" : "Short Preview",
		"spanish" : "Spanish",
		"english" : "English",
		"longPreview" : "Long Preview",
		"share" : "Share",
		"createPost" : "Create Post",
		"actions" : "Actions"
	},
	"es": {
		"language" : "es",
		"readMore" : "Ver mas",
		"posted" : "Subido el",
		"in" : "en",
		"drafts" : "Borradores",
		"posts" : "Posts",
		"uploadImages" : "Subir Imagenes",
		"images" : " Imagenes",
		"newPost" : " Post Nuevo",
		"date" : "Fecha",
		"title" : "Titulo",
		"publish" : "Publicar",
		"edit" : "Editar",
		"toDrafts" : "A Borradores",
		"delete" : "Borrar",
		"upload" : "Subir",
		"selectOrDrag" : "Selecciona o arrastra imagenes",
		"changeName" : "Cambiar Nombre",
		"editPost" : "Editar Post",
		"submit" : "Enviar",
		"shortPreview" : "Previsualizacion corta",
		"spanish" : "Español",
		"english" : "Ingles",
		"longPreview" : "Previsualizacion larga",
		"share" : "Compartir",
		"createPost" : "Crear Post",
		"actions" : "Acciones"
	}
};

function getWords(lang){
	if (lang == 'es')
		return strings.es;
	else
		return strings.en;
}