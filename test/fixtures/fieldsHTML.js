module.exports = (function () {/*
<div id="admin-update">
  <ul e-repeat="fields" data-eggs-repeat-template="
  &lt;li&gt;
  &lt;label e-attr=&quot;for:name&quot; e-text=&quot;name&quot;&gt;&lt;/label&gt;
  &lt;input e-if=&quot;textInput&quot; e-model=&quot;value&quot; e-attr=&quot;type:type,name:name,disabled:disabled,value:value&quot;&gt;
  &lt;input e-if=&quot;checkbox&quot; e-model=&quot;value&quot; type=&quot;checkbox&quot; e-attr=&quot;name:name,disabled:disabled,checked:value&quot;&gt;
  &lt;textarea e-if=&quot;textArea&quot; e-model=&quot;value&quot; e-attr=&quot;type:type,name:name,disabled:disabled&quot; e-text=&quot;value&quot;&gt;&lt;/textarea&gt;
  &lt;/li&gt;
  ">
  <li>
    <label e-attr="for:name" e-text="name" for="_id">_id</label>
    <input e-if="textInput" e-model="value" e-attr="type:type,name:name,disabled:disabled,value:value" data-eggs-if-template="&lt;input e-if=&quot;textInput&quot; e-model=&quot;value&quot; e-attr=&quot;type:type,name:name,disabled:disabled,value:value&quot;&gt;" value="54a70a94250e156aefb9c697" type="text" name="_id" disabled="true">
    <eggstemplatetag style="display:none" data-eggs-if-template="&lt;input e-if=&quot;checkbox&quot; e-model=&quot;value&quot; type=&quot;checkbox&quot; e-attr=&quot;name:name,disabled:disabled,checked:value&quot;&gt;" name="_id" disabled="true" checked="54a70a94250e156aefb9c697"></eggstemplatetag>
    <eggstemplatetag style="display:none" data-eggs-if-template="&lt;textarea e-if=&quot;textArea&quot; e-model=&quot;value&quot; e-attr=&quot;type:type,name:name,disabled:disabled&quot; e-text=&quot;value&quot;&gt;&lt;/textarea&gt;" type="text" name="_id" disabled="true">54a70a94250e156aefb9c697</eggstemplatetag>
  </li>

  <li>
    <label e-attr="for:name" e-text="name" for="title">title</label>
    <input e-if="textInput" e-model="value" e-attr="type:type,name:name,disabled:disabled,value:value" data-eggs-if-template="&lt;input e-if=&quot;textInput&quot; e-model=&quot;value&quot; e-attr=&quot;type:type,name:name,disabled:disabled,value:value&quot;&gt;" value="title" type="text" name="title">
    <eggstemplatetag style="display:none" data-eggs-if-template="&lt;input e-if=&quot;checkbox&quot; e-model=&quot;value&quot; type=&quot;checkbox&quot; e-attr=&quot;name:name,disabled:disabled,checked:value&quot;&gt;" name="title" checked="title"></eggstemplatetag>
    <eggstemplatetag style="display:none" data-eggs-if-template="&lt;textarea e-if=&quot;textArea&quot; e-model=&quot;value&quot; e-attr=&quot;type:type,name:name,disabled:disabled&quot; e-text=&quot;value&quot;&gt;&lt;/textarea&gt;" type="text" name="title">title</eggstemplatetag>
  </li>

  <li>
    <label e-attr="for:name" e-text="name" for="beep">beep</label>
    <input e-if="textInput" e-model="value" e-attr="type:type,name:name,disabled:disabled,value:value" data-eggs-if-template="&lt;input e-if=&quot;textInput&quot; e-model=&quot;value&quot; e-attr=&quot;type:type,name:name,disabled:disabled,value:value&quot;&gt;" value="beep" type="text" name="beep">
    <eggstemplatetag style="display:none" data-eggs-if-template="&lt;input e-if=&quot;checkbox&quot; e-model=&quot;value&quot; type=&quot;checkbox&quot; e-attr=&quot;name:name,disabled:disabled,checked:value&quot;&gt;" name="beep" checked="beep"></eggstemplatetag>
    <eggstemplatetag style="display:none" data-eggs-if-template="&lt;textarea e-if=&quot;textArea&quot; e-model=&quot;value&quot; e-attr=&quot;type:type,name:name,disabled:disabled&quot; e-text=&quot;value&quot;&gt;&lt;/textarea&gt;" type="text" name="beep">beep</eggstemplatetag>
  </li>

  <li>
    <label e-attr="for:name" e-text="name" for="boop">boop</label>
    <input e-if="textInput" e-model="value" e-attr="type:type,name:name,disabled:disabled,value:value" data-eggs-if-template="&lt;input e-if=&quot;textInput&quot; e-model=&quot;value&quot; e-attr=&quot;type:type,name:name,disabled:disabled,value:value&quot;&gt;" type="number" name="boop">
    <eggstemplatetag style="display:none" data-eggs-if-template="&lt;input e-if=&quot;checkbox&quot; e-model=&quot;value&quot; type=&quot;checkbox&quot; e-attr=&quot;name:name,disabled:disabled,checked:value&quot;&gt;" name="boop"></eggstemplatetag>
    <eggstemplatetag style="display:none" data-eggs-if-template="&lt;textarea e-if=&quot;textArea&quot; e-model=&quot;value&quot; e-attr=&quot;type:type,name:name,disabled:disabled&quot; e-text=&quot;value&quot;&gt;&lt;/textarea&gt;" type="number" name="boop"></eggstemplatetag>
  </li>

  <li>
    <label e-attr="for:name" e-text="name" for="bop">bop</label>
    <eggstemplatetag style="display:none" data-eggs-if-template="&lt;input e-if=&quot;textInput&quot; e-model=&quot;value&quot; e-attr=&quot;type:type,name:name,disabled:disabled,value:value&quot;&gt;" type="checkbox" name="bop"></eggstemplatetag>
    <input e-if="checkbox" e-model="value" type="checkbox" e-attr="name:name,disabled:disabled,checked:value" data-eggs-if-template="&lt;input e-if=&quot;checkbox&quot; e-model=&quot;value&quot; type=&quot;checkbox&quot; e-attr=&quot;name:name,disabled:disabled,checked:value&quot;&gt;" name="bop">
    <eggstemplatetag style="display:none" data-eggs-if-template="&lt;textarea e-if=&quot;textArea&quot; e-model=&quot;value&quot; e-attr=&quot;type:type,name:name,disabled:disabled&quot; e-text=&quot;value&quot;&gt;&lt;/textarea&gt;" type="checkbox" name="bop"></eggstemplatetag>
  </li>
</ul>
<a e-on="click:save">Save</a>

</div>
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
