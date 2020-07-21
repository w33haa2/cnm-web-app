<template>
    <div style="width:300px;">
        <template v-if="fetch_state=='success' && schedules.length>0">
            <template v-for="(item,index) in schedules"> 
                <div :key="index" class="hover-eee" style="border-bottom:#eee 1px solid">
                    <div style="display:flex;color:gray;border-left:solid 4px #F56C6C;" class="pl-10">
                        <div style="font-size:2em;padding:7px;border-radius:7px;text-align:center">
                            <div style="font-size:.35em">{{item.date.day1.toUpperCase()}}</div>
                            <div style="">{{item.date.d}}</div>
                            <div style="font-size:.35em">{{item.date.m.toUpperCase()}}</div>
                        </div>
                        <div style="padding-left:10px;padding-right:10px;width:100%;display:flex">
                            <div style="align-self:center">
                                <div style="font-size:.75em;" class="my-5">{{item.title_id == 1? "Regular Work":"Overtime"}}</div>
                                <div style='font-size:1.2em;' class="my-5">
                                    <template v-if="item.is_working">
                                        {{
                                            item.attendances[0].timelog.timein + " - " + (item.attendances[0].timelog.timeout?item.attendances[0].timelog.timeout:"--:----")
                                        }}
                                    </template>
                                    <template v-else>
                                        {{
                                            item.remarks.toUpperCase()
                                        }}
                                    </template>
                                </div>
                                <div style="font-size:.63em" class="my-5">{{ item.rendered_hours.night_difference }} NIGHT DIFFERENCE</div>
                            </div>
                        </div>
                    </div>
                    <div style="position:relative">
                        <div style="position:absolute;bottom:0px;right:0px;text-align:right;">
                        </div>
                    </div>
                </div>
            </template>
        </template>
        <template v-else>
            <div style="width:100%;padding-top:20px;text-align:center;font-style:italic;color:gray">
                {{fetch_state == "initial"? "Loading...":"No results found."}}
            </div>
        </template>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"; 
export default {
    name:"previousWorkContainer",
    props:["toggle"],
    computed:{
        ...mapGetters(["user_id"])
    },
    mounted(){
        this.fetchPreviousSchedules();
    },
    data(){
        return {
            schedules:null,
            fetch_state:"initial"
        }
    },
    watch:{
        toggle(v){
            this.fetchPreviousSchedules();
        }
    },
    methods:{
        fetchPreviousSchedules(){
            this.fetch_state = "initial";
            this.axiosRequest('get',"api/v1/schedules/previous?user_id="+this.user_id,{})
            .then(res=>{
                if(res.code == 200){
                    this.fetch_state = "success";
                    this.schedules = res.meta;
                }else{
                    this.fetch_state = "fail";
                    this.schedules = null;
                }
            })
            .catch(err=>{
                this.fetch_state ="fail";
            });
        }
    }
}
</script>