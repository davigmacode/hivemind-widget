# Trend Widget

## HTML Tag

```
<hivemind-trend></hivemind-trend>
```

## Properties

Name | Type | Required | Default | Options
--- | --- | --- | --- | ---
hiveid | String | yes | - | -
title | String | no | - | -
interval | String | no | daily | daily, weekly, monthly
engagement | String | no | basic | all, basic, reactions

## Example

```
<hivemind-trend
  hiveid="59099db7d8e7da00b8cc1c2d"
  interval="daily"
  engagement="basic"></hivemind-trend>
```
<hivemind-trend
  title="Example Result"
  hiveid="59099db7d8e7da00b8cc1c2d"
  interval="daily"
  engagement="basic"></hivemind-trend>
