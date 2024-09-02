<template>
  <div>
    <p>{{ comment.text }}</p>
    <p>— {{ comment.author }}</p>
  </div>
</template>

<script>
export default {
  name: "Comment",
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
};
</script>