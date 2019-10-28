<template>
  <div class="user-activity">
    <div class="post">
      <div class="user-block">
        <span class="username text-muted">SSS</span>
      </div>
      <p>{{ user.benefits[0].id_number ? user.benefits[0].id_number: "NA" }}</p>
    </div>
    <div class="post">
      <div class="user-block">
        <span class="username text-muted">PhilHealth</span>
      </div>
      <p>{{ user.benefits[1].id_number ? user.benefits[1].id_number: "NA" }}</p>
    </div>
    <div class="post">
      <div class="user-block">
        <span class="username text-muted">PagIbig</span>
      </div>
      <p>{{ user.benefits[2].id_number ? user.benefits[2].id_number: "NA" }}</p>
    </div>
    <div class="post">
      <div class="user-block">
        <span class="username text-muted">TIN</span>
      </div>
      <p>{{ user.benefits[3].id_number ? user.benefits[3].id_number: "NA" }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["user"],
  data() {
    return {};
  },
  created() {
    // console.log(this.user)
  }
};
</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {
    .username,
    .description {
      display: block;
      padding: 2px 0;
    }

    .username {
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;
    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {
      &:hover,
      &:focus {
        color: #999;
      }
    }
  }
}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
</style>
