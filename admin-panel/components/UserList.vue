<template>
  <div>
    <h2>Users</h2>
    <table class="table">
      <thead>
        <tr>
          <th>User ID</th>
          <th>Balance</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.balance }} points</td>
          <td>
            <button class="button" @click="selectUser(user.id)">Details</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
    };
  },
  async created() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await this.$axios.get(
          `${this.$config.public.apiUrl}/api/admin/users`
        );
        this.users = response.data.users;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    selectUser(userId) {
      this.$emit("select-user", userId);
    },
  },
};
</script>
