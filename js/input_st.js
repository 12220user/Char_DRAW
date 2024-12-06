$('.input-file input[type=file]').on('change', function() {
    let file = this.files[0];
    $(this).closest('.input-file').find('.input-file-text').html(file.name);
    //$('#ggg').attr('src', file.name)
});