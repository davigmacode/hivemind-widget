# Content Widget

## HTML Tag

```
<hivemind-content></hivemind-content>
```

## Properties

Name | Type | Required | Default | Options | Description
--- | --- | --- | --- | --- | ---
hiveid | String | yes | - | - | hive id from [Hivemind](//app.hivemind.id)
title | String | no | - | - | widget title
datetime | String | no | rv | sd, ld, st, lt, rv | datetime format
target | String | no | _blank | _blank, _self, _parent, _top | post link on click target
overflow | String | no | display | hidden, display | post link text overflow
engagement | String | no | hidden | hidden, basic, reactions | post engagement to display
optimizer | String | no | yes | yes, no | image optimizer
thumb | String | no | left | hidden, left, top | post thumbnail
limit | Number | no | - | 5 | posts limit to display
column | Number | no | - | - | default content column
column-lg | Number | no | - | - | content column on large screen
column-md | Number | no | - | - | content column on medium screen
column-sm | Number | no | - | - | content column on small screen
column-xs | Number | no | - | - | content column on phone screen

## Example

```
<hivemind-content
  title="Recommended for you:"
  hiveid="59b390b1d9e6a900c36974d9"
  datetime="hidden"
  overflow="display"
  engagement="hidden"
  optimizer="yes"
  thumb="top"
  limit="10"
  column="5"
  column-md="4"
  column-sm="3"
  column-xs="2"></hivemind-content>
```

<hivemind-content
  title="Recommended for you:"
  hiveid="59b390b1d9e6a900c36974d9"
  datetime="hidden"
  overflow="display"
  engagement="hidden"
  optimizer="yes"
  thumb="top"
  limit="10"
  column="5"
  column-md="4"
  column-sm="3"
  column-xs="2"></hivemind-content>
