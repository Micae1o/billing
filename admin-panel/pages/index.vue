<template>
  <div class="container">
    <h1>Admin Panel</h1>
    <UserList @select-user="selectUser" ref="userList" />
    <UserDetails
      v-if="selectedUser"
      :userId="selectedUser"
      @user-updated="updateUserList"
    />
  </div>
</template>

<script>
import UserList from "~/components/UserList.vue";
import UserDetails from "~/components/UserDetails.vue";

export default {
  components: {
    UserList,
    UserDetails,
  },
  data() {
    return {
      selectedUser: null,
    };
  },
  methods: {
    selectUser(userId) {
      this.selectedUser = userId;
    },
    updateUserList() {
      this.$refs.userList.fetchUsers();
    },
  },
};
</script>
