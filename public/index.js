const $ = window.$;

$("form").on("submit", function (e) {
  const $form = $(e.currentTarget);

  e.preventDefault();

  const inputs = {};
  $form.find('input[type="text"], input[type="date"]').each(function () {
    inputs[$(this).attr("name")] = $(this).val();
  });

  const endpoint = $form.attr("data-endpoint");
  $.get(`/api/works/${endpoint}`, inputs, function (data) {
    $form.find(".language-json").html(JSON.stringify(data, 1, 1));
  });
});
