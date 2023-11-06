<script setup lang="ts">
import { nanoid } from "nanoid";
import type { IColumn, ITask } from "../types/index";
import draggable from "vuedraggable";

const columns = useLocalStorage<IColumn[]>("kanbanBoard", [
  {
    id: nanoid(),
    title: "Backlog",
    tasks: [
      {
        id: nanoid(),
        title: "Create new product landing page",
        createdAt: new Date(),
      },
      {
        id: nanoid(),
        title: "Develop drag and drop feature in a SaaS project",
        createdAt: new Date(),
      },
      {
        id: nanoid(),
        title: "Fix undefined bug in main data table component",
        createdAt: new Date(),
      },
    ],
  },
  {
    id: nanoid(),
    title: "Selected for Development",
    tasks: [],
  },
  {
    id: nanoid(),
    title: "In Progress",
    tasks: [],
  },
  {
    id: nanoid(),
    title: "Code Review",
    tasks: [],
  },
  {
    id: nanoid(),
    title: "Ready for QA",
    tasks: [],
  },
  {
    id: nanoid(),
    title: "Ready to Release",
    tasks: [],
  },
  {
    id: nanoid(),
    title: "Done",
    tasks: [],
  },
]);
const alt = useKeyModifier("Alt");
watch(columns, () => {}, {
  deep: true,
});
const createColumn = () => {
  const column: IColumn = {
    id: nanoid(),
    title: "",
    tasks: [],
  };
  columns.value.push(column);
  nextTick(() => {
    (
      document.querySelector(
        ".column:last-of-type .title-input"
      ) as HTMLInputElement
    ).focus();
  });
};
</script>
<template>
  <div class="flex items-start overflow-x-auto gap-4">
    <draggable
      v-model="columns"
      group="columns"
      :animation="150"
      handle=".drag-handle"
      item-key="id"
      class="flex gap-4 items-start">
      <template #item="{ element: item }: { element: IColumn }">
        <div class="column bg-gray-300 p-5 rounded-2xl min-w-[250px]">
          <header class="font-bold mb-4 flex">
            <DragHandle class="pr-2" />
            <input
              class="title-input bg-transparent focus:bg-white rounded px-1 w-4/5"
              @keyup.enter="($event.target as HTMLInputElement).blur()"
              @keydown.backspace="
                item.title === ''
                  ? (columns = columns.filter((c) => c.id !== item.id))
                  : null
              "
              type="text"
              v-model="item.title" />
          </header>
          <draggable
            v-model="item.tasks"
            :group="{ name: 'tasks', pull: alt ? 'clone' : true }"
            handle=".drag-handle"
            :animation="150"
            item-key="id">
            <template #item="{ element: task }: { element: ITask }">
              <div>
                <TrelloBoardTask
                  :task="task"
                  @delete="
                    item.tasks = item.tasks.filter((t) => t.id !== $event)
                  " />
              </div>
            </template>
          </draggable>
          <footer>
            <NewTask @add="item.tasks.push($event)" />
          </footer>
        </div>
      </template>
    </draggable>
    <button
      @click="createColumn"
      class="bg-gray-200 whitespace-nowrap p-2 rounded-2xl opacity-50">
      + Add Another Column
    </button>
  </div>
</template>
