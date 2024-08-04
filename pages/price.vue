<template>
  <div class="page">
    <div class="header-container">
      <div class="header">
        <h6 class="header-title">Your current plan:</h6>
        <transition-group name="plan-group">
          <p class="header-text plan1" v-if="selected == 1">Starter - $19</p>
          <p class="header-text plan2" v-if="selected == 2">Pro - $99/month</p>
          <p class="header-text plan3" v-if="selected == 3">Enterprise</p>
        </transition-group>
      </div>
    </div>

    <section class="plans">
      <h1 class="plans-title">Choose a plan</h1>

      <div class="billing-option">
        <p class="billing-desc">Billed Monthly</p>
        <Checkbox class="billing-check" />
        <p class="billing-desc">Billed Annually</p>
      </div>

      <CardGrid>
        <Card price :topline="selected == 1">
          <template #title>Starter</template>
          <template #subtitle>$19</template>

          <template #features>
            <li>500 MAUs</li>
            <li>3 projects</li>
            <li>Unlimited guides</li>
            <li>Unlimited flows</li>
            <li>Unlimited branded themes</li>
            <li>Email support</li>
          </template>

          <template #footer>
            <!-- <VButton borderfill @click="select(1)" :disabled="selected === 1"
              >Choose Plan</VButton
            > -->
            <Button
              type="bordered"
              @click="select(1)"
              :disabled="selected === 1"
              >Choose Plan</Button
            >
          </template>
        </Card>

        <Card price topline>
          <template #title>Pro</template>
          <template #subtitle>
            $99<span class="card-price-desc">/month</span>
          </template>

          <template #features>
            <li>All starter features, plus:</li>
            <li>Unlimited projects</li>
            <li>Unlimited fully customizable themes</li>
            <li>A dedicated Customer Success Manager</li>
          </template>

          <template #footer>
            <Button
              type="filled"
              @click="select(2)"
              :disabled="selected === 2"
              icon="home"
              >Choose Plan</Button
            >
          </template>
        </Card>

        <Card price topline>
          <template #title>Enterprise</template>
          <template #subtitle>
            <span class="card-price-spectext">Let's Talk!</span>
          </template>

          <template #features>
            <li>500 MAUs</li>
            <li>3 projects</li>
            <li>Unlimited guides</li>
            <li>Unlimited flows</li>
            <li>Unlimited branded themes</li>
            <li>Email support</li>
          </template>

          <template #footer>
            <Button
              type="empty"
              corners="circle"
              @click="select(3)"
              :disabled="selected === 3"
              icon="add"
              onlyicon
            ></Button>
          </template>
        </Card>
      </CardGrid>
    </section>
    <section class="plans">
      <h1 class="plans-title">Choose a plan</h1>

      <div class="billing-option">
        <p class="billing-desc">Billed Monthly</p>
        <Checkbox class="billing-check" />
        <p class="billing-desc">Billed Annually</p>
      </div>

      <CardGrid>
        <Card price :topline="selected == 1">
          <template #title>Starter</template>
          <template #subtitle>$19</template>

          <template #features>
            <li>500 MAUs</li>
            <li>3 projects</li>
            <li>Unlimited guides</li>
            <li>Unlimited flows</li>
            <li>Unlimited branded themes</li>
            <li>Email support</li>
          </template>

          <template #footer>
            <VButton borderfill @click="select(1)" :disabled="selected === 1"
              >Choose Plan</VButton
            >
          </template>
        </Card>

        <Card price topline>
          <template #title>Pro</template>
          <template #subtitle>
            $99<span class="card-price-desc">/month</span>
          </template>

          <template #features>
            <li>All starter features, plus:</li>
            <li>Unlimited projects</li>
            <li>Unlimited fully customizable themes</li>
            <li>A dedicated Customer Success Manager</li>
          </template>

          <template #footer>
            <VButton
              full
              @click="select(2)"
              :disabled="selected === 2"
              icon="home"
              >Choose Plan</VButton
            >
          </template>
        </Card>

        <Card price topline>
          <template #title>Enterprise</template>
          <template #subtitle>
            <span class="card-price-spectext">Let's Talk!</span>
          </template>

          <template #features>
            <li>500 MAUs</li>
            <li>3 projects</li>
            <li>Unlimited guides</li>
            <li>Unlimited flows</li>
            <li>Unlimited branded themes</li>
            <li>Email support</li>
          </template>

          <template #footer>
            <VButton
              hoverfill
              round
              @click="select(3)"
              :disabled="selected === 3"
              icon="add"
              onlyicon
            ></VButton>
          </template>
        </Card>
      </CardGrid>
    </section>
    <section class="plans">
      <h1 class="plans-title">Choose a plan</h1>

      <div class="billing-option">
        <p class="billing-desc">Billed Monthly</p>
        <Checkbox class="billing-check" />
        <p class="billing-desc">Billed Annually</p>
      </div>

      <CardGrid>
        <Card price :topline="selected == 1">
          <template #title>Starter</template>
          <template #subtitle>$19</template>

          <template #features>
            <li>500 MAUs</li>
            <li>3 projects</li>
            <li>Unlimited guides</li>
            <li>Unlimited flows</li>
            <li>Unlimited branded themes</li>
            <li>Email support</li>
          </template>

          <template #footer>
            <VButton borderfill @click="select(1)" :disabled="selected === 1"
              >Choose Plan</VButton
            >
          </template>
        </Card>

        <Card price topline>
          <template #title>Pro</template>
          <template #subtitle>
            $99<span class="card-price-desc">/month</span>
          </template>

          <template #features>
            <li>All starter features, plus:</li>
            <li>Unlimited projects</li>
            <li>Unlimited fully customizable themes</li>
            <li>A dedicated Customer Success Manager</li>
          </template>

          <template #footer>
            <VButton
              full
              @click="select(2)"
              :disabled="selected === 2"
              icon="home"
              >Choose Plan</VButton
            >
          </template>
        </Card>

        <Card price topline>
          <template #title>Enterprise</template>
          <template #subtitle>
            <span class="card-price-spectext">Let's Talk!</span>
          </template>

          <template #features>
            <li>500 MAUs</li>
            <li>3 projects</li>
            <li>Unlimited guides</li>
            <li>Unlimited flows</li>
            <li>Unlimited branded themes</li>
            <li>Email support</li>
          </template>

          <template #footer>
            <VButton
              hoverfill
              round
              @click="select(3)"
              :disabled="selected === 3"
              icon="add"
              onlyicon
            ></VButton>
          </template>
        </Card>
      </CardGrid>
    </section>
  </div>
</template>

<script setup lang="ts">
import { NotificationType } from '~/stores/notifications';

const selected = ref(1);

const select = (id: number) => {
  const texts = [
    'Selected the card',
    'Nice',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pulvinar viverra vestibulum. Nullam et nisl eget quam accumsan dignissim ac at diam. Vivamus sagittis arcu sit amet justo euismod feugiat. Quisque non nunc facilisis, eleifend mi in, euismod enim.',
  ];

  const types = [
    NotificationType.INFO,
    NotificationType.SUCCESS,
    NotificationType.WARNING,
  ];

  useNotificationStore().send(texts[id - 1], types[id - 1], 1000 * (id + 2));
  selected.value = id;
};
</script>

<style scoped lang="scss">
.billing-check {
  margin-left: 15px;
  margin-right: 15px;
}

.header-container {
  display: flex;
  justify-content: center;
}

.header {
  box-sizing: content-box;
  text-align: center;

  background-color: var(--primary-color);

  padding: 20px 50px;

  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

  transition: 0.3s;
}

.header-title {
  color: var(--primary-color-contrast);
  font-size: 0.8rem;
}

.header-text {
  color: var(--primary-color-contrast);
  margin-top: 5px;
  font-size: 1.3rem;
  font-weight: 600;
}

.plans {
  margin-top: 40px;
  margin-bottom: 40px;

  display: flex;
  justify-content: center;
  align-items: center;

  flex-direction: column;
}

.billing-option {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.billing-desc {
  font-size: 0.9rem;
}

.card-price-spectext {
  margin-top: 25px;
  font-size: 2.7rem;
}

.card-price-desc {
  font-size: 1.5rem;
}

.plan-group-enter-from,
.plan-group-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.plan-group-enter-active {
  transition: 0.3s;
}

.plan-group-leave-active {
  transition: 0.3s;
  position: absolute;
}
</style>
