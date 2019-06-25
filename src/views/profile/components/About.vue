<template>
  <div class="user-activity">
    <div class="post">
      <div class="user-block">
        <span class="username text-muted">Full Name</span>
      </div>
      <p>
        {{ user.info.full_name }}
      </p>
    </div>
    <div class="post">
      <div class="user-block">
        <span class="username text-muted">Birth Date</span>
      </div>
      <p>
        {{ user.info.birthdate }}
      </p>
    </div>
    <div class="post">
      <div class="user-block">
        <span class="username text-muted">Gender</span>
      </div>
      <p>
        {{ user.info.gender }}
      </p>
    </div>
    <div class="post">
      <div class="user-block">
        <span class="username text-muted">Address</span>
      </div>
      <p>
        {{ user.info.address }}
      </p>
    </div>
    <div class="post">
      <div class="user-block">
        <span class="username text-muted">Personal Email</span>
      </div>
      <p>
        {{ user.info.p_mail }}
      </p>
    </div>
    <div class="post">
      <div class="user-block">
        <span class="username text-muted">Contact Number</span>
      </div>
      <p>
        {{ user.info.contact_number }}
      </p>
    </div>
  </div>
</template>

<script>
const avatarPrefix = '?imageView2/1/w/80/h/80'
const carouselPrefix = '?imageView2/2/h/440'

export default {
  props: ['user'],
  data() {
    return {
      carouselImages: [
        'https://wpimg.wallstcn.com/9679ffb0-9e0b-4451-9916-e21992218054.jpg',
        'https://wpimg.wallstcn.com/bcce3734-0837-4b9f-9261-351ef384f75a.jpg',
        'https://wpimg.wallstcn.com/d1d7b033-d75e-4cd6-ae39-fcd5f1c0a7c5.jpg',
        'https://wpimg.wallstcn.com/50530061-851b-4ca5-9dc5-2fead928a939.jpg'
      ],
      avatarPrefix,
      carouselPrefix
    }
  },
  created() {
    console.log(this.user)
  }
}
</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {

    .username,
    .description {
      display: block;
      padding: 2px 0;
    }

    .username{
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
