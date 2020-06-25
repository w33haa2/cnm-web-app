<template>
    <div>
        <div class="w-100 py-10 px-5" style="color:gray" :style="'transition:background 1s;border-bottom:3px solid '+data.color+';'+(hover?'background-color:'+adjustColor(data.color) :'background-color:transparent')" @mouseover="mouseOver" @mouseleave="mouseLeave">
            <div class="d-flex" style="justify-content:space-between;font-size:.8em">
                <div style="font-weight:lighter;font-spacing:2">{{data.label}} <small>({{data.value}}%)</small></div>
                <div style="font-weight:bold">{{data.count}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"DonutLabel",
    props:["data"],
    data(){
        return {
            hover:false,
        }
    },
    methods:{
        mouseOver(){
            this.hover = true;
        },
        mouseLeave(){
            this.hover = false;
        },
        adjustColor(color){
            return this.adjustColorTone(color, 60);
        }
    }
}
</script>