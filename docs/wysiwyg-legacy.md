## WYSIWYG CMS

Kickstart will add this snippet to your ```sandbox.html``` if you need additional JavaScript or CSS for your backend.
This might be the case when your CMS uses front-end-editing and you need to only adjust this view.

```HTML
<!-- front-end only: -->
<script async data-main="assets/js/<%= ProjectName %>" src="assets/js/libs/require.js"></script>

<!-- used in wysiwyg CMS:
<link rel="stylesheet" href="assets/css/backend.css">
<script src="assets/js/libs/require.js"></script>
<script charset="utf-8">
  require(['assets/js/projectName'], function() {
    require(['assets/js/deferred/backend'], function(Backend) {
      Backend.init();
    });
  });
</script>
-->
```

This setup assumes a deferred component named 'backend' (```yo kickstart:addcomponent backend```) where you can make changes only for your CMS.

The CMS then has to use the lower part of the snippet and include the backend component.
