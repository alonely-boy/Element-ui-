<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDiglog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="cateList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1,index1) in scope.row.children"
              :key="item1.cat_id"
              :class="['vcenter','bdbottom',index1 === 0?'bdtop' : '']"
            >
              <el-col :span="12">
                <el-tag closable @close="removeCateById(item1)" type="success">{{item1.cat_name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="12">
                <el-tag
                  v-for="(item2,index2) in item1.children" type="warning"
                  :key="item2.cat_id" closable @close="removeCateById(item2)"
                >{{item2.cat_name}}</el-tag>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="scope">
            <i
              v-if="!scope.row.cat_deleted"
              class="el-icon-circle-check"
              style="fontSize:25px;color:green;"
            ></i>
            <i v-else class="el-icon-circle-close" style="fontSize:25px;color:red;"></i>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row)"></el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="排序" prop="cat_level"></el-table-column> -->
      </el-table>
      <!-- 分页 -->
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- 级联选择器，options用来指定数据源 props指定配置对象-->
          <el-cascader
            v-model="selectedKeys"
            :props="cascaderProps"
            :options="parentCateList"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //商品分类数据列表，默认为空
      cateList: [],
      total: 0, //总数据条数
      addCateDialogVisible: false, //添加分类对话框
      //添加分类表单对象
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      //添加分类表单验证
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      //父级分类列表
      parentCateList: [],
      //指定级联选择器配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: true,
        checkStrictly: true
      },
      //选中的父级分类的Id数组
      selectedKeys: []
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败!");
      }
      // console.log(res.data.result);
      //把请求下来的数据列表给cateList,总数据条数给total
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getCateList();
    },
    handleCurrentChange(size) {
      this.queryInfo.pagenum = size;
      this.getCateList();
    },
    //点击按钮，添加分类对话框
    showAddCateDiglog() {
      //先获取父级分类数据列表
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    //获取父级分类数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据列表失败");
      }
      this.parentCateList = res.data;
      // console.log(this.parentCateList);
    },
    //选择项发生变化触发这个函数
    parentCateChanged() {
      // console.log(this.selectedKeys);
      //如果selectedKeys数组中的length大于0，证明选择了父级分类
      if (this.selectedKeys.length > 0) {
        //父级分类的ID
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        //为当前分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        //父级分类的ID
        this.addCateForm.cat_pid = 0;
        //为当前分类等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    //监听对话框关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    //点击按钮，添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败!");
        }
        this.$message.success("添加分类成功!");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    //删除分类
    async removeCateById(role){
      console.log(role);
      const confirmResult = await this.$confirm(
        "此操作将永久删除分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      //如果用户确认删除，则返回值为字符串confirm
      //如果用户取消删除，则返回值为字符串cancel
      // console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除");
      }
      const {data:res} = await this.$http.delete(`categories/${role.cat_id}`)
      if(res.meta.status != 200){
        return this.$message.errpr("删除分类失败")
      }
      console.log(res);
      
      this.$message.success("删除分类成功!");
      this.getCateList()
    }
  }
};
</script>

<style scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
.el-cascader {
  width: 100%;
}
</style>