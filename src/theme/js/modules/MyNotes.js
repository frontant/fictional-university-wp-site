import $ from "jquery";

class MyNotes{
    constructor(){
        this.events();
    }

    // event handler -----------------------

    events(){
        $(".delete-note").on("click", this.deleteNote);
        $(".edit-note").on("click", this.editNote.bind(this));
        $(".update-note").on("click", this.updateNote.bind(this));
    }

    // methods -----------------------------

    cacheNoteData(inNote){
        inNote.data("cache", {
            title: inNote.find(".note-title-field").val(),
            content: inNote.find(".note-body-field").val()
        });
    }

    restoreNoteDataCache(inNote){
        var noteDataCache = inNote.data("cache");
        
        if(typeof noteDataCache != "undefined"){
            inNote.find(".note-title-field").val(noteDataCache.title);
            inNote.find(".note-body-field").val(noteDataCache.content);

            this.clearNoteDataCache(inNote);
        }
    }

    clearNoteDataCache(inNote){
        inNote.removeData("cache");
    }

    deleteNote(e){
        var note = $(e.target).parents('li');

        $.ajax({
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
            },
            "url": universityData.root_url + "/wp-json/wp/v2/note/" + note.data('id'),
            "method" : "DELETE"
        })
        .done((response) => {
            console.log("SUCCESS");
            console.log(response);

            $(note).slideUp();
        })
        .fail((response) => {
            console.log("FAILED");
            console.log(response);
        });
    }

    editNote(e){
        var note = $(e.target).parents('li');
        var noteState = note.data("state");

        if(noteState != "editable"){
            this.cacheNoteData(note);
            this.makeNoteEditable(note);
        }else{
            this.makeNoteReadonly(note);
            this.restoreNoteDataCache(note);
        }
    }

    makeNoteEditable(inNote) {
        inNote
        .find(".note-title-field, .note-body-field")
        .removeAttr("readonly")
        .addClass("note-active-field");
        
        inNote
        .find(".update-note")
        .addClass("update-note--visible");
        
        inNote
        .find(".edit-note")
        .html('<i class="fa fa-times" aria-hidden="true"></i> Cancel');

        inNote.data("state", "editable");
    }

    makeNoteReadonly(inNote) {
        inNote
        .find(".note-title-field, .note-body-field")
        .attr("readonly", "readonly")
        .removeClass("note-active-field");
        
        inNote
        .find(".update-note")
        .removeClass("update-note--visible");
        
        inNote
        .find(".edit-note")
        .html('<i class="fa fa-pencil" aria-hidden="true"></i> Edit');

        inNote.data("state", "readonly");
    }

    updateNote(e){
        var note = $(e.target).parents('li');
        var updatedNote = {
            "title" : note.find(".note-title-field").val(),
            "content" : note.find(".note-body-field").val()
        };

        $.ajax({
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
            },
            "url": universityData.root_url + "/wp-json/wp/v2/note/" + note.data('id'),
            "method" : "POST",
            "data" : updatedNote
        })
        .done((response) => {
            console.log("SUCCESS");
            console.log(response);

            this.clearNoteDataCache(note);
            this.makeNoteReadonly(note);
        })
        .fail((response) => {
            console.log("FAILED");
            console.log(response);
        });
    }
}

export default MyNotes;