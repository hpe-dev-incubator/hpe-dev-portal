---
title: Integrating ISTIO and SPIRE
date: 2023-04-25T09:54:00.229Z
author: Nishant Chaturvedi, Akansha Sajimon
authorimage: /img/Avatar1.svg
disable: false
---
<!--\[if !mso]>
<style>
v\:* {behavior:url(#default#VML);}
o\:* {behavior:url(#default#VML);}
w\:* {behavior:url(#default#VML);}
.shape {behavior:url(#default#VML);}
</style>
<!\[endif]-->

<!--\[if gte mso 9]><xml>
 <o:OfficeDocumentSettings>
  <o:AllowPNG/>
 </o:OfficeDocumentSettings>
</xml><!\[endif]-->

<!--\[if gte mso 9]><xml>
 <w:WordDocument>
  <w:View>Normal</w:View>
  <w:Zoom>0</w:Zoom>
  <w:TrackMoves>false</w:TrackMoves>
  <w:TrackFormatting/>
  <w:PunctuationKerning/>
  <w:ValidateAgainstSchemas/>
  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
  <w:DoNotPromoteQF/>
  <w:LidThemeOther>EN-GB</w:LidThemeOther>
  <w:LidThemeAsian>X-NONE</w:LidThemeAsian>
  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>
  <w:Compatibility>
   <w:BreakWrappedTables/>
   <w:SnapToGridInCell/>
   <w:WrapTextWithPunct/>
   <w:UseAsianBreakRules/>
   <w:DontGrowAutofit/>
   <w:SplitPgBreakAndParaMark/>
   <w:EnableOpenTypeKerning/>
   <w:DontFlipMirrorIndents/>
   <w:OverrideTableStyleHps/>
  </w:Compatibility>
  <m:mathPr>
   <m:mathFont m:val="Cambria Math"/>
   <m:brkBin m:val="before"/>
   <m:brkBinSub m:val="&#45;-"/>
   <m:smallFrac m:val="off"/>
   <m:dispDef/>
   <m:lMargin m:val="0"/>
   <m:rMargin m:val="0"/>
   <m:defJc m:val="centerGroup"/>
   <m:wrapIndent m:val="1440"/>
   <m:intLim m:val="subSup"/>
   <m:naryLim m:val="undOvr"/>
  </m:mathPr></w:WordDocument>
</xml><!\[endif]-->

<!--\[if gte mso 9]><xml>
 <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"
  DefSemiHidden="false" DefQFormat="false" DefPriority="99"
  LatentStyleCount="376">
  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>
  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 6"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 7"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 8"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 9"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 1"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 2"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 3"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 4"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 5"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 6"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 7"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 8"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 9"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Normal Indent"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="footnote text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="annotation text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="header"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="footer"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index heading"/>
  <w:LsdException Locked="false" Priority="35" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="caption"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="table of figures"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="envelope address"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="envelope return"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="footnote reference"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="annotation reference"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="line number"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="page number"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="endnote reference"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="endnote text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="table of authorities"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="macro"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="toa heading"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 5"/>
  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Closing"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Signature"/>
  <w:LsdException Locked="false" Priority="1" SemiHidden="true"
   UnhideWhenUsed="true" Name="Default Paragraph Font"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text Indent"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Message Header"/>
  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Salutation"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Date"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text First Indent"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text First Indent 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Note Heading"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text Indent 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text Indent 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Block Text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Hyperlink"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="FollowedHyperlink"/>
  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>
  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Document Map"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Plain Text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="E-mail Signature"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Top of Form"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Bottom of Form"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Normal (Web)"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Acronym"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Address"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Cite"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Code"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Definition"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Keyboard"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Preformatted"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Sample"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Typewriter"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Variable"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Normal Table"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="annotation subject"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="No List"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Outline List 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Outline List 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Outline List 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Simple 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Simple 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Simple 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Colorful 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Colorful 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Colorful 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 6"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 7"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 8"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 6"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 7"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 8"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table 3D effects 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table 3D effects 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table 3D effects 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Contemporary"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Elegant"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Professional"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Subtle 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Subtle 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Web 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Web 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Web 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Balloon Text"/>
  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Theme"/>
  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>
  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>
  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>
  <w:LsdException Locked="false" Priority="34" QFormat="true"
   Name="List Paragraph"/>
  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>
  <w:LsdException Locked="false" Priority="30" QFormat="true"
   Name="Intense Quote"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>
  <w:LsdException Locked="false" Priority="19" QFormat="true"
   Name="Subtle Emphasis"/>
  <w:LsdException Locked="false" Priority="21" QFormat="true"
   Name="Intense Emphasis"/>
  <w:LsdException Locked="false" Priority="31" QFormat="true"
   Name="Subtle Reference"/>
  <w:LsdException Locked="false" Priority="32" QFormat="true"
   Name="Intense Reference"/>
  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>
  <w:LsdException Locked="false" Priority="37" SemiHidden="true"
   UnhideWhenUsed="true" Name="Bibliography"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>
  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>
  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>
  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>
  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>
  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>
  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>
  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>
  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>
  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 1"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 1"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 1"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 2"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 2"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 2"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 3"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 3"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 3"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 4"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 4"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 4"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 5"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 5"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 5"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 6"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 6"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 6"/>
  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>
  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>
  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 1"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 1"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 1"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 2"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 2"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 2"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 3"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 3"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 3"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 4"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 4"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 4"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 5"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 5"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 5"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 6"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 6"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 6"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Mention"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Smart Hyperlink"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Hashtag"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Unresolved Mention"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Smart Link"/>
 </w:LatentStyles>
</xml><!\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if gte mso 10]>
<style>
 /* Style Definitions */
 table.MsoNormalTable
	{mso-style-name:"Table Normal";
	mso-tstyle-rowband-size:0;
	mso-tstyle-colband-size:0;
	mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-parent:"";
	mso-padding-alt:0in 5.4pt 0in 5.4pt;
	mso-para-margin-top:0in;
	mso-para-margin-right:0in;
	mso-para-margin-bottom:8.0pt;
	mso-para-margin-left:0in;
	line-height:107%;
	mso-pagination:widow-orphan;
	font-size:11.0pt;
	font-family:"Calibri",sans-serif;
	mso-ascii-font-family:Calibri;
	mso-ascii-theme-font:minor-latin;
	mso-hansi-font-family:Calibri;
	mso-hansi-theme-font:minor-latin;
	mso-bidi-font-family:"Times New Roman";
	mso-bidi-theme-font:minor-bidi;
	mso-fareast-language:EN-US;}
</style>
<!\[endif]-->

<!--\[if gte mso 9]><xml>
 <o:shapedefaults v:ext="edit" spidmax="1060"/>
</xml><!\[endif]-->

<!--\[if gte mso 9]><xml>
 <o:shapelayout v:ext="edit">
  <o:idmap v:ext="edit" data="1"/>
 </o:shapelayout></xml><!\[endif]-->

<!--StartFragment-->

Authors : Nishant Chaturvedi , Akansha Sajimon

 

This blog demonstrates how to integrate ISTIO and SPIRE to enable advanced analysis and visualization of the service mesh.  



**ISTIO** 

 

Istio is an **open-source service mesh** that provides a uniform and efficient way to secure, connect, and monitor services. Istio automatically manages load balancing for HTTP, gRPC, WebSocket, and TCP traffic. For details, see [The Istio service mesh](https://istio.io/latest/about/service-mesh/).

 

 

<!--\[if gte vml 1]><v:shapetype id="_x0000_t75" coordsize="21600,21600"
 o:spt="75" o:preferrelative="t" path="m@4@5l@4@11@9@11@9@5xe" filled="f"
 stroked="f">
 <v:stroke joinstyle="miter"/>
 <v:formulas>
  <v:f eqn="if lineDrawn pixelLineWidth 0"/>
  <v:f eqn="sum @0 1 0"/>
  <v:f eqn="sum 0 0 @1"/>
  <v:f eqn="prod @2 1 2"/>
  <v:f eqn="prod @3 21600 pixelWidth"/>
  <v:f eqn="prod @3 21600 pixelHeight"/>
  <v:f eqn="sum @0 0 1"/>
  <v:f eqn="prod @6 1 2"/>
  <v:f eqn="prod @7 21600 pixelWidth"/>
  <v:f eqn="sum @8 21600 0"/>
  <v:f eqn="prod @7 21600 pixelHeight"/>
  <v:f eqn="sum @10 21600 0"/>
 </v:formulas>
 <v:path o:extrusionok="f" gradientshapeok="t" o:connecttype="rect"/>
 <o:lock v:ext="edit" aspectratio="t"/>
</v:shapetype><v:shape id="Picture_x0020_1" o:spid="_x0000_i1050" type="#_x0000_t75"
 style='width:337.5pt;height:243.5pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image001.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image002.png)<!--\[endif]-->\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

**SPIRE** 

 

SPIRE (SPIFFE Runtime Environment) is a production-ready implementation of the SPIFFE specification that performs node and workload attestation to securely issue cryptographic identities to workloads running in heterogeneous environments. 

 

                         <!--\[if gte vml 1]><v:shape
 id="Picture_x0020_3" o:spid="_x0000_i1049" type="#_x0000_t75" style='width:349.5pt;
 height:297pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image003.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image004.png)<!--\[endif]--> 

 

 

SPIRE can be configured as a source of cryptographic identities for Istio workloads through an integration with Envoy’s SDS (Secret Discovery Service) API.

This integration with SPIRE provides flexible attestation options not available with the default Istio identity management while harnessing Istio’s powerful service management. 

 <!--\[if gte vml 1]><v:shape id="Picture_x0020_2" o:spid="_x0000_i1048"
 type="#_x0000_t75" style='width:451pt;height:225.5pt;visibility:visible;
 mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image005.jpg"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image006.jpg)<!--\[endif]--> 

 

Later this spire issued certificates or identities to workloads or services can be used for communication between different trust domains or between two different clusters also. 

Use the steps in this blog to install Istio and Spire on the same cluster, then deploy a sample application using Spire-issued identities.  

 

**Step 1: Creating your own cluster**



<!--\[if !supportLists]-->**1.1**<!--\[endif]--> Go to [Greenlake](https://client.greenlake.hpe.com/session/hub/choose) client page.

 

<!--\[if !supportLists]-->**1.2**<!--\[endif]--> Login to your tenant in HPE GreenLake Central  and navigate to HPE GreenLake for Private Cloud Enterprise dashboard. Click on Containers to launch into the containers dashboard.

<!--\[if gte vml 1]><v:shape
 id="Picture_x0020_6" o:spid="_x0000_i1047" type="#_x0000_t75" style='width:367pt;
 height:153.5pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image007.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image008.jpg)<!--\[endif]-->

 

<!--\[if !supportLists]-->**1.3**<!--\[endif]--> You will notice a similar page as shown below. Click “create cluster” to create a new cluster, or you can also choose from the already created clusters. Ensure that you choose a cluster that does not have ISTIO pre-deployed, since this exercise will deploy SPIRE and ISTIO together.

 

<!--\[if gte vml 1]><v:shape id="Picture_x0020_10" o:spid="_x0000_i1046"
 type="#_x0000_t75" style='width:387.5pt;height:197.5pt;visibility:visible;
 mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image009.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image010.jpg)<!--\[endif]-->

 

 

<!--\[if !supportLists]-->**1.4**<!--\[endif]--> After clicking create cluster, give name and description to your cluster and type of cluster. In  our case we have chosen large type.

 

<!--\[if gte vml 1]><v:shape id="Picture_x0020_14" o:spid="_x0000_i1045"
 type="#_x0000_t75" style='width:171.5pt;height:173.5pt;visibility:visible;
 mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image011.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image012.jpg)<!--\[endif]--><!--\[if gte vml 1]><v:shape id="Picture_x0020_15"
 o:spid="_x0000_i1044" type="#_x0000_t75" style='width:170pt;height:167pt;
 visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image013.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image014.jpg)<!--\[endif]-->

 

<!--\[if !supportLists]-->**1.5**<!--\[endif]--> Obtain Kubeconfig for your cluster and launch a Web terminal to access your cluster for further steps in the document.

From the **Containers** main page, click **Launch Service Console** to launch the HPE Ezmeral Runtime Enterprise. Open Kubectl, which allows you to enter commands to communicate with your cluster.

If Kubectl is not installed, download Kubectl and the HPE Kubectl Plugin from the **Dashboard**.

For more information, see **[Dashboard - Kubernetes Tenant/Project Administrator](https://docs.containerplatform.hpe.com/55/reference/kubernetes/tenant-project-administration/Dashboard__Kubernetes_TenantProject_Administrator.html)** in the HPE Ezmeral Runtime Enterprise documentation.

 



**Step 2: Install Spire**

Get the quickstart yaml file using [this link](https://raw.githubusercontent.com/cxteamtrials/caas-trials-content/main/services/spire/spire-quickstart.yaml) and copy that into your cluster and apply it by using kubectl.

<!--\[if gte vml 1]><v:shapetype
 id="_x0000_t202" coordsize="21600,21600" o:spt="202" path="m,l,21600r21600,l21600,xe">
 <v:stroke joinstyle="miter"/>
 <v:path gradientshapeok="t" o:connecttype="rect"/>
</v:shapetype><v:shape id="Text_x0020_Box_x0020_5" o:spid="_x0000_s1059"
 type="#_x0000_t202" style='position:absolute;margin-left:0;margin-top:.1pt;
 width:441.15pt;height:20.65pt;z-index:251661317;visibility:visible;
 mso-wrap-style:square;mso-width-percent:0;mso-height-percent:0;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:left;
 mso-position-horizontal-relative:margin;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-height-percent:0;
 mso-width-relative:margin;mso-height-relative:margin;v-text-anchor:top'
 o:gfxdata="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
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    apply -f spire-quickstart.yaml<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                     |
| --- | ----------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                     |
|     | ![Text Box: kubectl apply -f spire-quickstart.yaml](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image015.png) |

<!--\[endif]-->

 

This will install SPIRE into your cluster, along with two additional components: the SPIFFE CSI Driver and the SPIRE Kubernetes **Controller manager** which facilitate the registration of workloads and establishment of federation relationships.

**2.1** Verify installation of spire by checking if all pods are running and containers within them are up. Specifically, you are looking for agent and spire server.

**Note**: Number of agents depends on number of nodes you are working with. Here we are working with three worker nodes, so three agents are assigned for each node.

Use the command given below, and you will get the output as shown.

<!--\[if gte vml 1]><v:shape id="Text_x0020_Box_x0020_4"
 o:spid="_x0000_s1058" type="#_x0000_t202" style='position:absolute;
 margin-left:-1.25pt;margin-top:5.6pt;width:300.05pt;height:20.4pt;z-index:251662341;
 visibility:visible;mso-wrap-style:square;mso-width-percent:0;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-width-relative:margin;
 v-text-anchor:top' o:gfxdata="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
bHNQSwUGAAAAAAUABQBnAQAAMQ4AAAAA
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    get pods -n spire<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                        |
| --- | ---------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                        |
|     | ![Text Box: kubectl get pods -n spire](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image016.png) |

<!--\[endif]-->

 

<!--\[if gte vml 1]><v:shape
 id="Picture_x0020_7" o:spid="_x0000_i1043" type="#_x0000_t75" style='width:451pt;
 height:80pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image017.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image018.jpg)<!--\[endif]-->

**Step 3: Install Istio**

<!--\[if !supportLists]-->**1.**    <!--\[endif]-->***Download the latest release:***  

You can download the latest release using the official ISTIO repository or just copy the following command, which would do the same for you.

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_29" o:spid="_x0000_s1057" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:35.05pt;
 margin-top:3pt;width:411.35pt;height:20.05pt;text-indent:0;z-index:251658242;
 visibility:visible;mso-wrap-style:square;mso-wrap-distance-left:9pt;
 mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;v-text-anchor:top' o:gfxdata="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
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>curl
    -L https://istio.io/downloadIstio | sh -<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                             |
|     | ![Text Box: curl -L https://istio.io/downloadIstio \| sh -](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image019.png) |

<!--\[endif]-->

 

For details reach out to [ISTIO download page](https://istio.io/latest/docs/setup/getting-started/#download).

cd into the Istio directory and set the path by command:

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_16" o:spid="_x0000_s1056" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:37.45pt;
 margin-top:2.55pt;width:246.7pt;height:20.8pt;z-index:251658241;visibility:visible;
 mso-wrap-style:square;mso-width-percent:0;mso-height-percent:0;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-height-percent:0;
 mso-width-relative:margin;mso-height-relative:margin;v-text-anchor:top'
 o:gfxdata="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
LnJlbHNQSwUGAAAAAAUABQBnAQAANA4AAAAA
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>export
    PATH=$PWD/bin:$PATH<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                         |
| --- | ----------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                         |
|     | ![Text Box: export PATH=$PWD/bin:$PATH](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image020.png) |

<!--\[endif]-->

 

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_11" o:spid="_x0000_s1055" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:35.8pt;
 margin-top:32.2pt;width:246.8pt;height:21.65pt;z-index:251663365;visibility:visible;
 mso-wrap-style:square;mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;
 mso-wrap-distance-right:9pt;mso-wrap-distance-bottom:0;
 mso-position-horizontal:absolute;mso-position-horizontal-relative:text;
 mso-position-vertical:absolute;mso-position-vertical-relative:text;
 v-text-anchor:top' o:gfxdata="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
AQAAIg4AAAAA
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>cd
    ..<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:shape><!\[endif]--><!--\[if !vml]-->![Text Box: cd ..](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image021.png)<!--\[endif]-->After exporting get out of directory.

 

 

**Note:** In the future, a case might occur when your cluster does not recognize “istioctl. ” In this case, export the path again after getting into istio directory.

 

**2*.**** **Install Istio with patches:***

After deploying SPIRE into your environment and verifying that all deployments are in Ready state, install Istio with custom patches for the Ingress-gateway as well as for Istio-proxy.

Get the Istio-spire-config patch using [this link](https://raw.githubusercontent.com/cxteamtrials/caas-trials-content/main/services/istio/release-1.17/spire/spire-patch.yaml) and copy that patch into your cluster. Install that patch using following command.  

<!--\[if gte vml 1]><v:shape id="Text_x0020_Box_x0020_30"
 o:spid="_x0000_s1054" type="#_x0000_t202" style='position:absolute;
 margin-left:36.3pt;margin-top:.5pt;width:4in;height:21.3pt;z-index:251658243;
 visibility:visible;mso-wrap-style:square;mso-width-percent:0;
 mso-height-percent:0;mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;
 mso-wrap-distance-right:9pt;mso-wrap-distance-bottom:0;
 mso-position-horizontal:absolute;mso-position-horizontal-relative:text;
 mso-position-vertical:absolute;mso-position-vertical-relative:text;
 mso-width-percent:0;mso-height-percent:0;mso-width-relative:margin;
 mso-height-relative:margin;v-text-anchor:top' o:gfxdata="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
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>istioctl
    install -f istio-spire-config.yaml<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:shape><!\[endif]--><!--\[if !vml]-->![Text Box: istioctl install -f istio-spire-config.yaml](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image022.png)<!--\[endif]-->             

This will share the spiffe-csi-driver with the Ingress Gateway and the sidecars that are going to be injected on workload pods, granting them access to the SPIRE Agent’s UNIX Domain Socket.

**3.** ***Patching Istio-Ingress gateways***

If you receive the error shown below, your ingress-gateway is not patched yet and is not being registered onto the server.

<!--\[if gte vml 1]><v:shape id="Picture_x0020_9" o:spid="_x0000_i1042"
 type="#_x0000_t75" style='width:451pt;height:82pt;visibility:visible;
 mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image023.jpg"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image024.jpg)<!--\[endif]-->

**3.1**    For patching, the first step is to get and apply one of spire controller manager’s CRD ClusterSPIFFEID. It is a cluster-wide resource used to register workloads with SPIRE. The ClusterSPIFFEID can target all workloads in the cluster or can be optionally scoped to specific pods or namespaces via label selectors.

Create a ClusterSPIFFEID crd to generate registration entries in spire server for all workloads with the label ***spiffe.io/spire-managed-identity: true*.*                                                                        [ ](<>)***

Get the ClusterSPIFFEID used by us for this demo using [this link](https://raw.githubusercontent.com/cxteamtrials/caas-trials-content/main/services/spire/clusterspiffeid-example.yaml), copy that into your cluster, and apply it.

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_32" o:spid="_x0000_s1053" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:36.3pt;
 margin-top:2.05pt;width:442pt;height:23.15pt;z-index:251658244;visibility:visible;
 mso-wrap-style:square;mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;
 mso-wrap-distance-right:9pt;mso-wrap-distance-bottom:0;
 mso-position-horizontal:absolute;mso-position-horizontal-relative:text;
 mso-position-vertical:absolute;mso-position-vertical-relative:text;
 v-text-anchor:top' o:gfxdata="UEsDBBQABgAIAAAAIQC75UiUBQEAAB4CAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbKSRvU7DMBSF
dyTewfKKEqcMCKEmHfgZgaE8wMW+SSwc27JvS/v23KTJgkoXFsu+P+c7Ol5vDoMTe0zZBl/LVVlJ
gV4HY31Xy4/tS3EvRSbwBlzwWMsjZrlprq/W22PELHjb51r2RPFBqax7HCCXIaLnThvSAMTP1KkI
+gs6VLdVdad08ISeCho1ZLN+whZ2jsTzgcsnJwldluLxNDiyagkxOquB2Knae/OLUsyEkjenmdzb
mG/YhlRnCWPnb8C898bRJGtQvEOiVxjYhtLOxs8AySiT4JuDystlVV4WPeM6tK3VaILeDZxIOSsu
ti/jidNGNZ3/J08yC1dNv9v8AAAA//8DAFBLAwQUAAYACAAAACEArTA/8cEAAAAyAQAACwAAAF9y
ZWxzLy5yZWxzhI/NCsIwEITvgu8Q9m7TehCRpr2I4FX0AdZk2wbbJGTj39ubi6AgeJtl2G9m6vYx
jeJGka13CqqiBEFOe2Ndr+B03C3WIDihMzh6RwqexNA281l9oBFTfuLBBhaZ4ljBkFLYSMl6oAm5
8IFcdjofJ0z5jL0MqC/Yk1yW5UrGTwY0X0yxNwri3lQgjs+Qk/+zfddZTVuvrxO59CNCmoj3vCwj
MfaUFOjRhrPHaN4Wv0VV5OYgm1p+LW1eAAAA//8DAFBLAwQUAAYACAAAACEAU4cKwIkDAAA0CQAA
HwAAAGNsaXBib2FyZC9kcmF3aW5ncy9kcmF3aW5nMS54bWzsVl1v2zgQfD/g/gPBd8fyV5IaVQrH
PQcF0jSIc+jzmqJsIRTJI2nH7q+/ISXHdlK0QO/u7RJAXu6ORsPhktL7D9tasY10vjI6572zjDOp
hSkqvcz5n4+zziVnPpAuSBktc76Tnn+4+v239zReOrKrSjAwaD+mnK9CsONu14uVrMmfGSs1aqVx
NQUM3bJbOHoGc626/Sw779ZUaX51oPpIgdjaVb9ApYx4ksWU9IY8KJUYH2dajUr8c2Ya682Ns3N7
76Jycbe5d6wqcg7nNNWwiHfbQgvDsPvqruWBYFu6OuJNWbItVmBwMRr2wLXL+fDyoj8YjRo+uQ1M
ADA67w2GGQACiP47hC1ArL78hEKs/vgxCWQ2chAcSfQ2CtSbt3Me9PeTfoz6rs2WIbWff8SzsEUW
84rZZMOexbcO/ksGvGinsXU+3EhTsxjk3EkRUpfR5taHRsYeEifmjaqKWaVUGsTmlVPl2IZUzsO2
l25V6/qzKZrc+SiD/2mSSEfTE3SwT0NJ2gKRJc355AFKs+ecnwOdiE9qUdXLoxeKxFPr2hEK7Eo3
tK2BYTtPCxSdLnZxEgv8wnpnMHt0irdiVoH6lny4J4ediiT2fPiCS6kM9AhVWc5Wxn17nYs47BpU
OHvGjs+5/2tNTnKmPmmf83e94RB0IQ2Go4s+Bu64sjiu6HU9NfC1l1SlMOKD2oelM/VX44pJfCpK
pAWejYXYh9OAEQo4VoScTFIsTG0p3Oq5xQZvFixa+bj9Ss62XRDQoHdmviIrv9cMDTb1uZmsgymr
tlMaL2NB+TAPOyXTyifHY3/X5G6TCAQPMUjQKCUGsP5ehKZBetlF2zhpDQ+Ia1nuscE32NRfsZGs
OFQnZXiNu2w6sUGmOsK2L9B8NHaQqCge5lJ3bq5h+zdY1MNtieqk9d1y8dJ9s/T3tv1oLMsSG6rZ
STCFQqVZ2FlZksDhNyVVLVzFmSVtPBJZP5tlI1zj/zAbxCuqVRCrGdWVwik2QEKsyHmZ1jz5K+k/
IBX+iPSxqqVnd/KZPZia9InifnYOpSPojcoHbxT38FY8VQzbYXX0NFw9rRdwSDGyVu1Yp2RCrX2Q
ruNtBfM+fewIV5ztqFbxRMSaxpvjrVIXcX8+/HDN/vcfDfw9/w/uJUexQ6O7L4fi2su5fcDCNG+A
5tQEIr7duq++F9Kt7fdN/Cg5Hl/9DQAA//8DAFBLAwQUAAYACAAAACEAkn2H4B0HAABJIAAAGgAA
AGNsaXBib2FyZC90aGVtZS90aGVtZTEueG1s7FlLbxs3EL4X6H9Y7L2xZL1iI3JgyXLcxC9ESooc
KYnaZcxdLkjKjm5FcuqlQIG06KEBeuuhKBqgARr00h9jwEGb/ogOuS9SouIHXCAobAHG7uw3w+HM
7Mzs8M7dZxH1jjEXhMVtv3qr4ns4HrExiYO2/2iw/dlt3xMSxWNEWYzb/gwL/+7Gp5/cQesjSpIh
Q3w8CHGEPRAUi3XU9kMpk/WVFTECMhK3WIJjeDZhPEISbnmwMuboBBaI6MpqpdJciRCJ/Q2QKJWg
HoV/sRSKMKK8r8RgL0YRrH4wmZAR1tjxUVUhxEx0KfeOEW37IHPMTgb4mfQ9ioSEB22/ov/8lY07
K2g9Y6JyCa/Bt63/Mr6MYXy0qtfkwbBYtF5v1JubhXwNoHIR12v1mr1mIU8D0GgEO011sWW2Vrv1
DGuA0kuH7K3WVq1q4Q35tQWdNxvqZ+E1KJVfX8Bvb3fBihZeg1J8YwHf6Kx1tmz5GpTimwv4VmVz
q96y5GtQSEl8tICuNJq1br7bAjJhdMcJX2vUt1urmfASBdFQRJdaYsJiuSzWIvSU8W0AKCBFksSe
nCV4gkYQk11EyZATb5cEIQRegmImgFxZrWxXavBf/er6SnsUrWNkcCu9QBOxQFL6eGLESSLb/n2Q
6huQs7dvT5+/OX3+++mLF6fPf83W1qIsvh0UBybf+5+++efVl97fv/34/uW36dLzeGHi3/3y1bs/
/vyQeNhxaYqz716/e/P67Puv//r5pUP6JkdDEz4gERbePj7xHrIINujQHw/55TgGISImx2YcCBQj
tYpDfk+GFnp/hihy4DrYtuNjDqnGBbw3fWop3A/5VBKHxAdhZAH3GKMdxp1WeKDWMsw8mMaBe3E+
NXEPETp2rd1FseXl3jSBHEtcIrshttQ8pCiWKMAxlp56xo4wduzuCSGWXffIiDPBJtJ7QrwOIk6T
DMjQiqaSaYdE4JeZS0Hwt2Wbvcdeh1HXrrfwsY2EdwNRh/IDTC0z3kNTiSKXyAGKqGnwXSRDl5L9
GR+ZuJ6Q4OkAU+b1xlgIF88Bh/0aTn8Aacbt9j06i2wkl+TIJXMXMWYit9hRN0RR4sL2SRya2M/F
EYQo8g6ZdMH3mP2GqHvwA4qXuvsxwZa7z88GjyDDmiqVAaKeTLnDl/cws+K3P6MThF2pZpNHVord
5MQZHZ1pYIX2LsYUnaAxxt6jzx0adFhi2bxU+n4IWWUHuwLrPrJjVd3HWGBPNzeLeXKXCCtk+zhg
S/TZm80lnhmKI8SXSd4Hr5s270Gpi1wBcEBHRyZwn0C/B/HiNMqBABlGcC+Vehgiq4Cpe+GO1xm3
/HeRdwzey6eWGhd4L4EHX5oHErvJ80HbDBC1FigDZoCgy3ClW2Cx3F+yqOKq2aZOvon90pZugO7I
anoiEp/bAc31Po3/rveBDuPsh1eOl+16+h23YCtZXbLTWZZMdub6m2W4+a6my/iYfPxNzRaaxocY
6shixrrpaW56Gv9/39Mse59vOpll/cZNJ+NDh3HTyWTDlevpZMrmBfoaNfBIBz167BMtnfpMCKV9
OaN4V+jBj4DvmfE2EBWfnm7iYgqYhHCpyhwsYOECjjSPx5n8gsiwH6IEpkNVXwkJRCY6EF7CBAyN
NNkpW+HpNNpj43TYWa2qwWZaWQWSJb3SKOgwqJIputkqB3iFeK1toAetuQKK9zJKGIvZStQcSrRy
ojKSHuuC0RxK6J1dixZrDi1uK/G5qxa0ANUKr8AHtwef6W2/UQcWYIJ5HDTnY+Wn1NW5d7Uzr9PT
y4xpRQA02HkElJ5eU7ou3Z7aXRpqF/C0pYQRbrYS2jK6wRMhfAZn0amoF1Hjsr5eK11qqadModeD
0CrVaN3+kBZX9TXwzecGGpuZgsbeSdtv1hoQMiOUtP0JDI3hMkogdoT65kI0gOOWkeTpC3+VzJJw
IbeQCFOD66STZoOISMw9SqK2r7ZfuIHGOodo3aqrkBA+WuXWIK18bMqB020n48kEj6TpdoOiLJ3e
QoZPc4XzqWa/Olhxsim4ux+OT7whnfKHCEKs0aoqA46JgLODamrNMYHDsCKRlfE3V5iytGueRukY
SumIJiHKKoqZzFO4TuWFOvqusIFxl+0ZDGqYJCuEw0AVWNOoVjUtqkaqw9Kqez6TspyRNMuaaWUV
VTXdWcxaIS8Dc7a8WpE3tMpNDDnNrPBp6p5PuWt5rpvrE4oqAQYv7OeouhcoCIZq5WKWakrjxTSs
cnZGtWtHvsFzVLtIkTCyfjMXO2e3okY4lwPilSo/8M1HLZAmeV+pLe062N5DiTcMqm0fDpdhOPgM
ruB42gfaqqKtKhpcwZkzlIv0oLjtZxc5BZ6nlAJTyym1HFPPKfWc0sgpjZzSzClN39MnqnCKrw5T
fS8/MIUalh2wZr2Fffq/8S8AAAD//wMAUEsDBBQABgAIAAAAIQCcZkZBuwAAACQBAAAqAAAAY2xp
cGJvYXJkL2RyYXdpbmdzL19yZWxzL2RyYXdpbmcxLnhtbC5yZWxzhI/NCsIwEITvgu8Q9m7SehCR
Jr2I0KvUBwjJNi02PyRR7Nsb6EVB8LIws+w3s037sjN5YkyTdxxqWgFBp7yenOFw6y+7I5CUpdNy
9g45LJigFdtNc8VZ5nKUxikkUigucRhzDifGkhrRykR9QFc2g49W5iKjYUGquzTI9lV1YPGTAeKL
STrNIXa6BtIvoST/Z/thmBSevXpYdPlHBMulFxagjAYzB0pXZ501LV2BiYZ9/SbeAAAA//8DAFBL
AQItABQABgAIAAAAIQC75UiUBQEAAB4CAAATAAAAAAAAAAAAAAAAAAAAAABbQ29udGVudF9UeXBl
c10ueG1sUEsBAi0AFAAGAAgAAAAhAK0wP/HBAAAAMgEAAAsAAAAAAAAAAAAAAAAANgEAAF9yZWxz
Ly5yZWxzUEsBAi0AFAAGAAgAAAAhAFOHCsCJAwAANAkAAB8AAAAAAAAAAAAAAAAAIAIAAGNsaXBi
b2FyZC9kcmF3aW5ncy9kcmF3aW5nMS54bWxQSwECLQAUAAYACAAAACEAkn2H4B0HAABJIAAAGgAA
AAAAAAAAAAAAAADmBQAAY2xpcGJvYXJkL3RoZW1lL3RoZW1lMS54bWxQSwECLQAUAAYACAAAACEA
nGZGQbsAAAAkAQAAKgAAAAAAAAAAAAAAAAA7DQAAY2xpcGJvYXJkL2RyYXdpbmdzL19yZWxzL2Ry
YXdpbmcxLnhtbC5yZWxzUEsFBgAAAAAFAAUAZwEAAD4OAAAAAA==
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    apply -f cluster-spiffeID-crd.yaml<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                         |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                         |
|     | ![Text Box: kubectl apply -f cluster-spiffeID-crd.yaml](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image025.png) |

<!--\[endif]-->

 





**Note:** You can create your own custom clusterSPIFFEID crd with your own match label and own selector. For now, we have created simple crd with one pod selector and one match label.

**3.2** Now simply patch the ingress-gateway with spiffe.io/spire managed-identity: true label.

 This will register your ingress-gateway pod into the server. 

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_33" o:spid="_x0000_s1052" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:35.8pt;
 margin-top:.8pt;width:454.9pt;height:43.85pt;z-index:251658245;visibility:visible;
 mso-wrap-style:square;mso-width-percent:0;mso-height-percent:0;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:margin;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-height-percent:0;
 mso-width-relative:margin;mso-height-relative:margin;v-text-anchor:top'
 o:gfxdata="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
0sgpjZzSzClN39MnqnCKrw5TfS8/MIUalh2wZr2Fffq/8S8AAAD//wMAUEsDBBQABgAIAAAAIQCc
ZkZBuwAAACQBAAAqAAAAY2xpcGJvYXJkL2RyYXdpbmdzL19yZWxzL2RyYXdpbmcxLnhtbC5yZWxz
hI/NCsIwEITvgu8Q9m7SehCRJr2I0KvUBwjJNi02PyRR7Nsb6EVB8LIws+w3s037sjN5YkyTdxxq
WgFBp7yenOFw6y+7I5CUpdNy9g45LJigFdtNc8VZ5nKUxikkUigucRhzDifGkhrRykR9QFc2g49W
5iKjYUGquzTI9lV1YPGTAeKLSTrNIXa6BtIvoST/Z/thmBSevXpYdPlHBMulFxagjAYzB0pXZ501
LV2BiYZ9/SbeAAAA//8DAFBLAQItABQABgAIAAAAIQC75UiUBQEAAB4CAAATAAAAAAAAAAAAAAAA
AAAAAABbQ29udGVudF9UeXBlc10ueG1sUEsBAi0AFAAGAAgAAAAhAK0wP/HBAAAAMgEAAAsAAAAA
AAAAAAAAAAAANgEAAF9yZWxzLy5yZWxzUEsBAi0AFAAGAAgAAAAhAN0VqWi4BAAArQ0AAB8AAAAA
AAAAAAAAAAAAIAIAAGNsaXBib2FyZC9kcmF3aW5ncy9kcmF3aW5nMS54bWxQSwECLQAUAAYACAAA
ACEAkn2H4B0HAABJIAAAGgAAAAAAAAAAAAAAAAAVBwAAY2xpcGJvYXJkL3RoZW1lL3RoZW1lMS54
bWxQSwECLQAUAAYACAAAACEAnGZGQbsAAAAkAQAAKgAAAAAAAAAAAAAAAABqDgAAY2xpcGJvYXJk
L2RyYXdpbmdzL19yZWxzL2RyYXdpbmcxLnhtbC5yZWxzUEsFBgAAAAAFAAUAZwEAAG0PAAAAAA==
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal style='margin-bottom:0in;line-height:normal;tab-stops:
    45.8pt 91.6pt 137.4pt 183.2pt 229.0pt 274.8pt 320.6pt 366.4pt 412.2pt 458.0pt 503.8pt 549.6pt 595.4pt 641.2pt 687.0pt 732.8pt'><span
    style='font-size:10.0pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
    mso-bidi-font-family:"Courier New";color:white;mso-themecolor:background1;
    mso-fareast-language:EN-GB'>kubectl patch deployment istio-ingressgateway
    -n istio-system -p '{&quot;spec&quot;:{&quot;template&quot;:{&quot;metadata&quot;:{&quot;labels&quot;:{&quot;spiffe.io/spire-managed-identity&quot;:
    &quot;true&quot;}}}}}'<o:p></o:p></span></p>
    <p class=MsoNormal><o:p>&nbsp;</o:p></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                                                                                                                                                |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                                                                                                                                                |
|     | ![Text Box: kubectl patch deployment istio-ingressgateway -n istio-system -p '{"spec":{"template":{"metadata":{"labels":{"spiffe.io/spire-managed-identity": "true"}}}}}'

](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image026.png) |

<!--\[endif]-->

 

 



After patching, confirm the working of your ingress-gateway pod, istiod, and all their containers.

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_37" o:spid="_x0000_s1051" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:0;margin-top:2.8pt;
 width:374.15pt;height:23.8pt;z-index:251659269;visibility:visible;
 mso-wrap-style:square;mso-width-percent:0;mso-wrap-distance-left:9pt;
 mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:center;
 mso-position-horizontal-relative:margin;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-width-relative:margin;
 v-text-anchor:top' o:gfxdata="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
LnJlbHNQSwUGAAAAAAUABQBnAQAANA4AAAAA
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    get pods -n istio-system<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                               |
| --- | ----------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                               |
|     | ![Text Box: kubectl get pods -n istio-system](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image027.png) |

<!--\[endif]-->

 

              <!--\[if gte vml 1]><v:shape id="Picture_x0020_13" o:spid="_x0000_i1041"
 type="#_x0000_t75" style='width:377pt;height:45.5pt;visibility:visible;
 mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image028.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image029.jpg)<!--\[endif]-->

 

**Step 4: Deploying sample application**

Now that our SPIRE and ISTIO are integrated, the identities to workloads must be issued by SPIRE.

For our case, we will create a namespace “bookinfo” and will add a label “**spiffe.io/spire-managed-identity: true**” to it, then we will create a new ClusterSPIFFEID crd with **namespace selector** with match label as “spiffe.io/spire-managed-identity: true.”

Now when the new workload is added to this namespace or any other namespace which has the label mentioned above, then automatically it will get registered in the server.

**4.1** Create a new namespace.

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_12" o:spid="_x0000_s1050" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:361.2pt;
 margin-top:.3pt;width:412.4pt;height:20.4pt;z-index:251664389;visibility:visible;
 mso-wrap-style:square;mso-width-percent:0;mso-height-percent:0;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:right;
 mso-position-horizontal-relative:margin;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-height-percent:0;
 mso-width-relative:margin;mso-height-relative:margin;v-text-anchor:top'
 o:gfxdata="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
AAAABQAFAGcBAABjDgAAAAA=
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    create namespace &lt;insert-namespace-name-here&gt;<o:p></o:p></span></p>
    <p class=MsoNormal><o:p>&nbsp;</o:p></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                                         |
|     | ![Text Box: kubectl create namespace \<insert-namespace-name-here>

](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image030.png) |

<!--\[endif]-->

 

4.2 Add a label to it, same as that you have used for clusterSPIFFEID.

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_35" o:spid="_x0000_s1049" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:362.5pt;
 margin-top:1.3pt;width:413.7pt;height:23.3pt;z-index:251665413;visibility:visible;
 mso-wrap-style:square;mso-width-percent:0;mso-wrap-distance-left:9pt;
 mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:right;
 mso-position-horizontal-relative:margin;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-width-relative:margin;
 v-text-anchor:top' o:gfxdata="UEsDBBQABgAIAAAAIQC75UiUBQEAAB4CAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbKSRvU7DMBSF
dyTewfKKEqcMCKEmHfgZgaE8wMW+SSwc27JvS/v23KTJgkoXFsu+P+c7Ol5vDoMTe0zZBl/LVVlJ
gV4HY31Xy4/tS3EvRSbwBlzwWMsjZrlprq/W22PELHjb51r2RPFBqax7HCCXIaLnThvSAMTP1KkI
+gs6VLdVdad08ISeCho1ZLN+whZ2jsTzgcsnJwldluLxNDiyagkxOquB2Knae/OLUsyEkjenmdzb
mG/YhlRnCWPnb8C898bRJGtQvEOiVxjYhtLOxs8AySiT4JuDystlVV4WPeM6tK3VaILeDZxIOSsu
ti/jidNGNZ3/J08yC1dNv9v8AAAA//8DAFBLAwQUAAYACAAAACEArTA/8cEAAAAyAQAACwAAAF9y
ZWxzLy5yZWxzhI/NCsIwEITvgu8Q9m7TehCRpr2I4FX0AdZk2wbbJGTj39ubi6AgeJtl2G9m6vYx
jeJGka13CqqiBEFOe2Ndr+B03C3WIDihMzh6RwqexNA281l9oBFTfuLBBhaZ4ljBkFLYSMl6oAm5
8IFcdjofJ0z5jL0MqC/Yk1yW5UrGTwY0X0yxNwri3lQgjs+Qk/+zfddZTVuvrxO59CNCmoj3vCwj
MfaUFOjRhrPHaN4Wv0VV5OYgm1p+LW1eAAAA//8DAFBLAwQUAAYACAAAACEAxiRE/6cDAABgCQAA
HwAAAGNsaXBib2FyZC9kcmF3aW5ncy9kcmF3aW5nMS54bWzsVk1vGzcQvRfofyB4yM3W6tORknUg
u5VRwHUMy0WOxYjLlQhzyS1JyVJ+fR+5K0uygxTox602IA1nZoePb95w9fHTttJsI51X1uS8e55x
Jo2whTLLnP/2ODt7z5kPZArS1sic76Tnny5//OEjTZaO6pUSDBWMn1DOVyHUk07Hi5WsyJ/bWhrE
SusqCli6Zadw9IzKle70smzUqUgZfnko9RMFYmun/kYpbcWTLK7JbMijpBaTY0+LUYt/XpkmZnPj
6nl97yJycbe5d0wVOQdzhipQxDttoE3DsvPqqeWhwLZ0Vcy3Zcm26EB/NM5GqLXL+cVgPOpeDJt6
chuYQMKwN+z3h0POBDJ64+G4m7Ubrj7/RQmx+vn7RQCzgQPjCKKvI0CzeXvmPnA0h36M+K7slsG1
P3/MZ2ELL84VvYmGfRXfMvgvEfCCnSa18+FG2opFI+dOipBURptbHxoY+5R4MG+1KmZK67SI4pXX
2rEN6ZyHbTc9qtfVr7ZofKNhlrWcwx1JT6n9vRtI0gjEKunMJxtow55zPkJ2KnwSi6hetl5oEk8t
a0dZqK5NU7YlMGznqUGR6WIXD7HAN6h3FqeHlHwtZgqlb8mHe3KYVDgx8+EzPkptgUdoVXO2su7r
a1/Mw9QgwtkzJj7n/o81OcmZ/sX4nI+7gwHKhbQYDC96WLjjyOI4YtbVtQWv3YQqmTE/6L1ZOlt9
sa6Yxl0RIiOwNxqxN68DVgjgWhFyOk22sFVN4dbMawx407BI5eP2C7m6VUGAQO/sfEW1/JYYmtyk
cztdB1uqVikNlzGgfZiHnZZJ3onxqO+K3G0CAeMhGik1QokGqL8XoRFIN7tohZN6eMi4kuU+N/gm
N+krCqkWh+i0DK/z3jdKbDJTHGarC4iPJg4QNcXLXJqzmyvQ/hUUdfFYKnUifbdcvKhvlv7eyo8m
siwxUM0kgRQKyrCwq2VJApffNWm1cIqzmoz1cGS9bJYN8Rn/B1k/fiKqgljNqFIat1gfDrEi52Xq
eeJX0n9QVPijoo+qkp7dyWf2YCsyJ4h7uIL7QD1IyPtvEHfxVjxFDNpBdeQ0XD6tF2BIg/eF1Ol+
9DXI8eydDh/idZmWv0fr3TJ8wHwqcHqubAeWk2dAQ0tZnKlCmqDCLg9uLVm8PdH/uFHcRpoizvLD
d/v7f68g9m/16sBeYhTTHNl9uUDXXs7rBzSxeVs0Nywy4puw8+q3RXq0/S0Uf8Acry//BAAA//8D
AFBLAwQUAAYACAAAACEAkn2H4B0HAABJIAAAGgAAAGNsaXBib2FyZC90aGVtZS90aGVtZTEueG1s
7FlLbxs3EL4X6H9Y7L2xZL1iI3JgyXLcxC9ESoocKYnaZcxdLkjKjm5FcuqlQIG06KEBeuuhKBqg
ARr00h9jwEGb/ogOuS9SouIHXCAobAHG7uw3w+HM7Mzs8M7dZxH1jjEXhMVtv3qr4ns4HrExiYO2
/2iw/dlt3xMSxWNEWYzb/gwL/+7Gp5/cQesjSpIhQ3w8CHGEPRAUi3XU9kMpk/WVFTECMhK3WIJj
eDZhPEISbnmwMuboBBaI6MpqpdJciRCJ/Q2QKJWgHoV/sRSKMKK8r8RgL0YRrH4wmZAR1tjxUVUh
xEx0KfeOEW37IHPMTgb4mfQ9ioSEB22/ov/8lY07K2g9Y6JyCa/Bt63/Mr6MYXy0qtfkwbBYtF5v
1JubhXwNoHIR12v1mr1mIU8D0GgEO011sWW2Vrv1DGuA0kuH7K3WVq1q4Q35tQWdNxvqZ+E1KJVf
X8Bvb3fBihZeg1J8YwHf6Kx1tmz5GpTimwv4VmVzq96y5GtQSEl8tICuNJq1br7bAjJhdMcJX2vU
t1urmfASBdFQRJdaYsJiuSzWIvSU8W0AKCBFksSenCV4gkYQk11EyZATb5cEIQRegmImgFxZrWxX
avBf/er6SnsUrWNkcCu9QBOxQFL6eGLESSLb/n2Q6huQs7dvT5+/OX3+++mLF6fPf83W1qIsvh0U
Bybf+5+++efVl97fv/34/uW36dLzeGHi3/3y1bs//vyQeNhxaYqz716/e/P67Puv//r5pUP6JkdD
Ez4gERbePj7xHrIINujQHw/55TgGISImx2YcCBQjtYpDfk+GFnp/hihy4DrYtuNjDqnGBbw3fWop
3A/5VBKHxAdhZAH3GKMdxp1WeKDWMsw8mMaBe3E+NXEPETp2rd1FseXl3jSBHEtcIrshttQ8pCiW
KMAxlp56xo4wduzuCSGWXffIiDPBJtJ7QrwOIk6TDMjQiqaSaYdE4JeZS0Hwt2Wbvcdeh1HXrrfw
sY2EdwNRh/IDTC0z3kNTiSKXyAGKqGnwXSRDl5L9GR+ZuJ6Q4OkAU+b1xlgIF88Bh/0aTn8Aacbt
9j06i2wkl+TIJXMXMWYit9hRN0RR4sL2SRya2M/FEYQo8g6ZdMH3mP2GqHvwA4qXuvsxwZa7z88G
jyDDmiqVAaKeTLnDl/cws+K3P6MThF2pZpNHVord5MQZHZ1pYIX2LsYUnaAxxt6jzx0adFhi2bxU
+n4IWWUHuwLrPrJjVd3HWGBPNzeLeXKXCCtk+zhgS/TZm80lnhmKI8SXSd4Hr5s270Gpi1wBcEBH
RyZwn0C/B/HiNMqBABlGcC+Vehgiq4Cpe+GO1xm3/HeRdwzey6eWGhd4L4EHX5oHErvJ80HbDBC1
FigDZoCgy3ClW2Cx3F+yqOKq2aZOvon90pZugO7IanoiEp/bAc31Po3/rveBDuPsh1eOl+16+h23
YCtZXbLTWZZMdub6m2W4+a6my/iYfPxNzRaaxocY6shixrrpaW56Gv9/39Mse59vOpll/cZNJ+ND
h3HTyWTDlevpZMrmBfoaNfBIBz167BMtnfpMCKV9OaN4V+jBj4DvmfE2EBWfnm7iYgqYhHCpyhws
YOECjjSPx5n8gsiwH6IEpkNVXwkJRCY6EF7CBAyNNNkpW+HpNNpj43TYWa2qwWZaWQWSJb3SKOgw
qJIputkqB3iFeK1toAetuQKK9zJKGIvZStQcSrRyojKSHuuC0RxK6J1dixZrDi1uK/G5qxa0ANUK
r8AHtwef6W2/UQcWYIJ5HDTnY+Wn1NW5d7Uzr9PTy4xpRQA02HkElJ5eU7ou3Z7aXRpqF/C0pYQR
brYS2jK6wRMhfAZn0amoF1Hjsr5eK11qqadModeD0CrVaN3+kBZX9TXwzecGGpuZgsbeSdtv1hoQ
MiOUtP0JDI3hMkogdoT65kI0gOOWkeTpC3+VzJJwIbeQCFOD66STZoOISMw9SqK2r7ZfuIHGOodo
3aqrkBA+WuXWIK18bMqB020n48kEj6TpdoOiLJ3eQoZPc4XzqWa/Olhxsim4ux+OT7whnfKHCEKs
0aoqA46JgLODamrNMYHDsCKRlfE3V5iytGueRukYSumIJiHKKoqZzFO4TuWFOvqusIFxl+0ZDGqY
JCuEw0AVWNOoVjUtqkaqw9Kqez6TspyRNMuaaWUVVTXdWcxaIS8Dc7a8WpE3tMpNDDnNrPBp6p5P
uWt5rpvrE4oqAQYv7OeouhcoCIZq5WKWakrjxTSscnZGtWtHvsFzVLtIkTCyfjMXO2e3okY4lwPi
lSo/8M1HLZAmeV+pLe062N5DiTcMqm0fDpdhOPgMruB42gfaqqKtKhpcwZkzlIv0oLjtZxc5BZ6n
lAJTyym1HFPPKfWc0sgpjZzSzClN39MnqnCKrw5TfS8/MIUalh2wZr2Fffq/8S8AAAD//wMAUEsD
BBQABgAIAAAAIQCcZkZBuwAAACQBAAAqAAAAY2xpcGJvYXJkL2RyYXdpbmdzL19yZWxzL2RyYXdp
bmcxLnhtbC5yZWxzhI/NCsIwEITvgu8Q9m7SehCRJr2I0KvUBwjJNi02PyRR7Nsb6EVB8LIws+w3
s037sjN5YkyTdxxqWgFBp7yenOFw6y+7I5CUpdNy9g45LJigFdtNc8VZ5nKUxikkUigucRhzDifG
khrRykR9QFc2g49W5iKjYUGquzTI9lV1YPGTAeKLSTrNIXa6BtIvoST/Z/thmBSevXpYdPlHBMul
FxagjAYzB0pXZ501LV2BiYZ9/SbeAAAA//8DAFBLAQItABQABgAIAAAAIQC75UiUBQEAAB4CAAAT
AAAAAAAAAAAAAAAAAAAAAABbQ29udGVudF9UeXBlc10ueG1sUEsBAi0AFAAGAAgAAAAhAK0wP/HB
AAAAMgEAAAsAAAAAAAAAAAAAAAAANgEAAF9yZWxzLy5yZWxzUEsBAi0AFAAGAAgAAAAhAMYkRP+n
AwAAYAkAAB8AAAAAAAAAAAAAAAAAIAIAAGNsaXBib2FyZC9kcmF3aW5ncy9kcmF3aW5nMS54bWxQ
SwECLQAUAAYACAAAACEAkn2H4B0HAABJIAAAGgAAAAAAAAAAAAAAAAAEBgAAY2xpcGJvYXJkL3Ro
ZW1lL3RoZW1lMS54bWxQSwECLQAUAAYACAAAACEAnGZGQbsAAAAkAQAAKgAAAAAAAAAAAAAAAABZ
DQAAY2xpcGJvYXJkL2RyYXdpbmdzL19yZWxzL2RyYXdpbmcxLnhtbC5yZWxzUEsFBgAAAAAFAAUA
ZwEAAFwOAAAAAA==
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    label namespaces &lt;namespace_name&gt; spiffe.io/spire-managed-identity=true
    <o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|     |                                                                                                                                                                                |
|     | ![Text Box: kubectl label namespaces \<namespace_name> spiffe.io/spire-managed-identity=true ](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image031.png) |

<!--\[endif]-->

 

4.3 Enable istio-injection for this namespace so that any new pods that are created in that namespace will automatically have a sidecar added to them. You can achieve this by just adding another label in similar fashion.

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_38" o:spid="_x0000_s1048" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:35.8pt;
 margin-top:1.55pt;width:409.1pt;height:22.45pt;z-index:251666437;visibility:visible;
 mso-wrap-style:square;mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;
 mso-wrap-distance-right:9pt;mso-wrap-distance-bottom:0;
 mso-position-horizontal:absolute;mso-position-horizontal-relative:text;
 mso-position-vertical:absolute;mso-position-vertical-relative:text;
 v-text-anchor:top' o:gfxdata="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
AQAAWw4AAAAA
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    label namespace &lt;namespace_name&gt; istio-injection=enabled --overwrite<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                                                            |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                                                            |
|     | ![Text Box: kubectl label namespace \<namespace_name> istio-injection=enabled --overwrite](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image032.png) |

<!--\[endif]-->

 

After all edits to your namespace, the namespace would look similar as shown below.

**Note**: You can edit further if you want using following command, but take care that your resulting yaml is not invalid. You can validate your yaml using any online validator available.

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_39" o:spid="_x0000_s1047" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:360.8pt;
 margin-top:3.25pt;width:412pt;height:20pt;z-index:251667461;visibility:visible;
 mso-wrap-style:square;mso-width-percent:0;mso-wrap-distance-left:9pt;
 mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:right;
 mso-position-horizontal-relative:margin;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-width-relative:margin;
 v-text-anchor:top' o:gfxdata="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
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    edit ns &lt;namespace_name&gt;<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------ |
|     |                                                                                                                                |
|     | ![Text Box: kubectl edit ns \<namespace_name>](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image033.png) |

<!--\[endif]-->

 

<!--\[if gte vml 1]><v:shape id="Picture_x0020_19"
 o:spid="_x0000_i1040" type="#_x0000_t75" style='width:451.5pt;height:136pt;
 visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image034.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image035.jpg)<!--\[endif]-->

 

**4.2** Create and apply a ClusterSPIFFEID crd with namespace selector.

Copy the clusterSPIFFEID from [this link](https://raw.githubusercontent.com/cxteamtrials/caas-trials-content/main/services/spire/clusterspiffeid-example.yaml) and just change the selector to **namespace selector** and make sure that the correct match label is there like shown below.

<!--\[if gte vml 1]><v:shape id="Picture_x0020_40"
 o:spid="_x0000_i1039" type="#_x0000_t75" style='width:451pt;height:79pt;
 visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image036.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image037.jpg)<!--\[endif]--> 

After editing your clusterSPIFFEID, apply it using kubectl.

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_41" o:spid="_x0000_s1046" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:363.25pt;
 margin-top:1.95pt;width:414.45pt;height:20.4pt;z-index:251669509;visibility:visible;
 mso-wrap-style:square;mso-width-percent:0;mso-wrap-distance-left:9pt;
 mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:right;
 mso-position-horizontal-relative:margin;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-width-relative:margin;
 v-text-anchor:top' o:gfxdata="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
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    apply -f &lt;your_clusterSPIFFEID_name&gt;<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ |
|     |                                                                                                                                            |
|     | ![Text Box: kubectl apply -f \<your_clusterSPIFFEID_name>](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image038.png) |

<!--\[endif]-->

 

 



**4.3** After successfully creating namespace and applying crd, deploy your application in the namespace you created. But before you deploy your application, the workloads will need the SPIFFE CSI Driver volume to access the SPIRE Agent socket. To accomplish this, we can leverage the spire pod annotation template:

annotations:

            inject.istio.io/templates: "sidecar,spire"

You can patch it to workload or just add this to your deployment manifest at **{spec:{template:{metadata:{ annotation:}}}}** as shown below.

<!--\[if gte vml 1]><v:shape id="Picture_x0020_21"
 o:spid="_x0000_i1038" type="#_x0000_t75" style='width:313.5pt;height:154pt;
 visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image039.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image039.png)<!--\[endif]-->

You can get the sample bookinfo application manifest from [this link](https://raw.githubusercontent.com/cxteamtrials/caas-trials-content/main/services/istio/release-1.16/samples/bookinfo/bookinfo.yaml).

**Note**: This manifest is annotation free, so you need to add annotation to its deployments by following above shown steps.

After editing the manifest, apply it in a newly created namespace.

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_42" o:spid="_x0000_s1045" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:35.4pt;
 margin-top:.6pt;width:434.1pt;height:21.25pt;z-index:251670533;visibility:visible;
 mso-wrap-style:square;mso-width-percent:0;mso-wrap-distance-left:9pt;
 mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-width-relative:margin;
 v-text-anchor:top' o:gfxdata="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
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    apply -f bookinfo.yaml -n &lt;namespace_name&gt;<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
|     |                                                                                                                                                  |
|     | ![Text Box: kubectl apply -f bookinfo.yaml -n \<namespace_name>](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image040.png) |

<!--\[endif]-->

 

Verify all workloads and services you just deployed are running and up.

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_43" o:spid="_x0000_s1044" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:35.4pt;
 margin-top:1.6pt;width:434.05pt;height:21.25pt;z-index:251671557;visibility:visible;
 mso-wrap-style:square;mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;
 mso-wrap-distance-right:9pt;mso-wrap-distance-bottom:0;
 mso-position-horizontal:absolute;mso-position-horizontal-relative:text;
 mso-position-vertical:absolute;mso-position-vertical-relative:text;
 v-text-anchor:top' o:gfxdata="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
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    get all -n &lt;namespace_name&gt;<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                   |
| --- | --------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                   |
|     | ![Text Box: kubectl get all -n \<namespace_name>](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image041.png) |

<!--\[endif]-->

 

You will get output as shown below if everything is working fine.

<!--\[if gte vml 1]><v:shape id="Picture_x0020_44"
 o:spid="_x0000_i1037" type="#_x0000_t75" style='width:431.5pt;height:262pt;
 visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image042.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image043.jpg)<!--\[endif]-->

 

Once everything is up, all workloads would get registered under spire server.

**4.5** You can verify the registration of workloads using the following command:

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_45" o:spid="_x0000_s1043" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:36.2pt;
 margin-top:.35pt;width:439.9pt;height:26.2pt;z-index:251672581;visibility:visible;
 mso-wrap-style:square;mso-width-percent:0;mso-height-percent:0;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-height-percent:0;
 mso-width-relative:margin;mso-height-relative:margin;v-text-anchor:top'
 o:gfxdata="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
AAUABQBnAQAAYQ4AAAAA
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    exec &lt;spire-server_pod_name&gt; -n spire -c spire-server --
    ./bin/spire-server entry show<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                                                                              |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                                                                              |
|     | ![Text Box: kubectl exec \<spire-server_pod_name> -n spire -c spire-server -- ./bin/spire-server entry show](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image044.png) |

<!--\[endif]-->

 

Verify that every workload with same label as clusterSPIFFEID crd’s match label is registered in the [](<>)[server](<>)<!--\[if !supportAnnotations]-->[\[GM1]](#_msocom_1)<!--\[endif]--> <!--\[if !supportAnnotations]-->[\[CN2]](#_msocom_2)<!--\[endif]--> .

<!--\[if gte vml 1]><v:shape
 id="Picture_x0020_25" o:spid="_x0000_i1036" type="#_x0000_t75" style='width:440pt;
 height:153pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image045.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image046.jpg)<!--\[endif]-->

 

**4.6** Verify that the certificate issuer of workloads is spire using following commands for each workload.

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_46" o:spid="_x0000_s1042" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:35.8pt;
 margin-top:-.1pt;width:448.65pt;height:36.6pt;z-index:251673605;visibility:visible;
 mso-wrap-style:square;mso-width-percent:0;mso-height-percent:0;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-height-percent:0;
 mso-width-relative:margin;mso-height-relative:margin;v-text-anchor:top'
 o:gfxdata="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
aloBQae8npzhcOsvuyOQlKXTcvYOOSyYoBXbTXPFWeZylMYpJFIoLnEYcw4nxpIa0cpEfUBXNoOP
VuYio2FBqrs0yPZVdWDxkwHii0k6zSF2ugbSL6Ek/2f7YZgUnr16WHT5RwTLpRcWoIwGMwdKV2ed
NS1dgYmGff0m3gAAAP//AwBQSwECLQAUAAYACAAAACEAu+VIlAUBAAAeAgAAEwAAAAAAAAAAAAAA
AAAAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQItABQABgAIAAAAIQCtMD/xwQAAADIBAAALAAAA
AAAAAAAAAAAAADYBAABfcmVscy8ucmVsc1BLAQItABQABgAIAAAAIQCUzjhBDgQAAM8LAAAfAAAA
AAAAAAAAAAAAACACAABjbGlwYm9hcmQvZHJhd2luZ3MvZHJhd2luZzEueG1sUEsBAi0AFAAGAAgA
AAAhAJJ9h+AdBwAASSAAABoAAAAAAAAAAAAAAAAAawYAAGNsaXBib2FyZC90aGVtZS90aGVtZTEu
eG1sUEsBAi0AFAAGAAgAAAAhAJxmRkG7AAAAJAEAACoAAAAAAAAAAAAAAAAAwA0AAGNsaXBib2Fy
ZC9kcmF3aW5ncy9fcmVscy9kcmF3aW5nMS54bWwucmVsc1BLBQYAAAAABQAFAGcBAADDDgAAAAA=
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='font-size:10.0pt;line-height:107%;
    color:white;mso-themecolor:background1'>istioctl proxy-config secret &lt;pod_name&gt;
    -n &lt;namespace_name&gt; -o json | jq -r
    '.dynamicActiveSecrets\[0].secret.tlsCertificate.certificateChain.inlineBytes'
    | base64 --decode &gt; chain.pem<o:p></o:p></span></p>
    <p class=MsoNormal><o:p>&nbsp;</o:p></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:shape><v:shape id="Text_x0020_Box_x0020_47" o:spid="_x0000_s1041" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:38.3pt;
 margin-top:61.85pt;width:446.1pt;height:24.15pt;z-index:251674629;
 visibility:visible;mso-wrap-style:square;mso-height-percent:0;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-height-percent:0;
 mso-height-relative:margin;v-text-anchor:top' o:gfxdata="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
AGcBAABdDgAAAAA=
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>openssl
    x509 -in chain.pem -text | grep SPIRE<o:p></o:p></span></p>
    <p class=MsoNormal><o:p>&nbsp;</o:p></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                                                                                                                                                                                |                                                                                                                                                 |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                                                                                                                                                                                |                                                                                                                                                 |
|     | ![Text Box: istioctl proxy-config secret \<pod_name> -n \<namespace_name> -o json \| jq -r '.dynamicActiveSecrets\[0\].secret.tlsCertificate.certificateChain.inlineBytes' \| base64 --decode > chain.pem

](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image047.png) |                                                                                                                                                 |
|     |                                                                                                                                                                                                                                                                                                |                                                                                                                                                 |
|     |                                                                                                                                                                                                                                                                                                | ![Text Box: openssl x509 -in chain.pem -text \| grep SPIRE

](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image048.png) |

<!--\[endif]-->

 

 

 



<!--\[if gte vml 1]><v:shape
 id="Picture_x0020_24" o:spid="_x0000_i1035" type="#_x0000_t75" style='width:451.5pt;
 height:53.5pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image049.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image050.jpg)<!--\[endif]-->

You should also check the same for ingress-gateway pod in istio-system namespace and verify that your deployed workloads and ingress-gateway has the same issuer.

 

**Step 5: Open the application outside traffic**

The Bookinfo application is deployed but not accessible from the outside. To make it accessible, you need to create an [Istio Ingress Gateway](https://istio.io/latest/docs/concepts/traffic-management/#gateways), which maps a path to a route at the edge of your mesh.

<!--\[if gte vml 1]><v:shape id="Text_x0020_Box_x0020_48"
 o:spid="_x0000_s1040" type="#_x0000_t202" style='position:absolute;
 margin-left:.4pt;margin-top:31.85pt;width:458.65pt;height:24.15pt;z-index:251675653;
 visibility:visible;mso-wrap-style:square;mso-height-percent:0;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-height-percent:0;
 mso-height-relative:margin;v-text-anchor:top' o:gfxdata="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
LlZiK7+//898eey74h2TRKbKlHZqCiTPdaRQmbfN8+TBFJKBauiYsDIjilkubm/mr9hB1kfSxkEK
VSGpTJvz8Oic+BZ7EMsDkk4aTj1kvabgBvA7COhm0+mdS781zOJCs1jXlUnremaKzTjo5r+1uWmi
xxX7fY+Ur6xwWblQBSEFzJWx9tQ51dIqq3HXMcr/xGjVUOoi7X5QPt2JRpfgYEPM7X67F0yeKasV
67l3UTTuc9XgEAQnpS3vnUA/dChuy7yL1LAjzAdOeg7fvUmAjAcY7Qjq8RzAC9ea69MxYyL4cu4u
fnXxAQAA//8DAFBLAQItABQABgAIAAAAIQC75UiUBQEAAB4CAAATAAAAAAAAAAAAAAAAAAAAAABb
Q29udGVudF9UeXBlc10ueG1sUEsBAi0AFAAGAAgAAAAhAK0wP/HBAAAAMgEAAAsAAAAAAAAAAAAA
AAAANgEAAF9yZWxzLy5yZWxzUEsBAi0AFAAGAAgAAAAhAFO3OL8ZBAAAXRAAAB8AAAAAAAAAAAAA
AAAAIAIAAGNsaXBib2FyZC9kcmF3aW5ncy9kcmF3aW5nMS54bWxQSwECLQAUAAYACAAAACEAkn2H
4B0HAABJIAAAGgAAAAAAAAAAAAAAAAB2BgAAY2xpcGJvYXJkL3RoZW1lL3RoZW1lMS54bWxQSwEC
LQAUAAYACAAAACEA8iRHvRsBAAAeAgAAKgAAAAAAAAAAAAAAAADLDQAAY2xpcGJvYXJkL2RyYXdp
bmdzL19yZWxzL2RyYXdpbmcxLnhtbC5yZWxzUEsFBgAAAAAFAAUAZwEAAC4PAAAAAA==
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    apply -f</span><span style='color:#8EAADB;mso-themecolor:accent1;
    mso-themetint:153'> </span><a
    href="https://raw.githubusercontent.com/istio/istio/release-1.17/samples/bookinfo/networking/bookinfo-gateway.yaml"
    target="_blank"><span style='color:#8EAADB;mso-themecolor:accent1;
    mso-themetint:153'>samples/bookinfo/networking/bookinfo-gateway.yaml</span></a><span
    style='color:white;mso-themecolor:background1'> -n bookinfo<o:p></o:p></span></p>
    <p class=MsoNormal><o:p>&nbsp;</o:p></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:shape><!\[endif]--><!--\[if !vml]-->![Text Box: kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml -n bookinfo

](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image051.png)<!--\[endif]-->**5.1** Associate this application with the Istio gateway:

 

<!--\[if gte vml 1]><v:shape id="Text_x0020_Box_x0020_49"
 o:spid="_x0000_s1039" type="#_x0000_t202" style='position:absolute;
 margin-left:-.4pt;margin-top:33.25pt;width:458.65pt;height:24.55pt;z-index:251676677;
 visibility:visible;mso-wrap-style:square;mso-wrap-distance-left:9pt;
 mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;v-text-anchor:top' o:gfxdata="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
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>istioctl
    analyze -n bookinfo<o:p></o:p></span></p>
    <p class=MsoNormal><o:p>&nbsp;</o:p></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:shape><!\[endif]--><!--\[if !vml]-->![Text Box: istioctl analyze -n bookinfo

](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image052.png)<!--\[endif]-->**5.2** Ensure that there are no issues with the configuration:

 

<!--\[if gte vml 1]><v:shape
 id="Picture_x0020_50" o:spid="_x0000_i1034" type="#_x0000_t75" style='width:459.5pt;
 height:37.5pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image053.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image054.jpg)<!--\[endif]-->

<!--\[if gte vml 1]><v:shape id="Text_x0020_Box_x0020_51"
 o:spid="_x0000_s1038" type="#_x0000_t202" style='position:absolute;
 margin-left:362.6pt;margin-top:57.15pt;width:413.8pt;height:22.9pt;z-index:251677701;
 visibility:visible;mso-wrap-style:square;mso-width-percent:0;
 mso-height-percent:0;mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;
 mso-wrap-distance-right:9pt;mso-wrap-distance-bottom:0;
 mso-position-horizontal:right;mso-position-horizontal-relative:margin;
 mso-position-vertical:absolute;mso-position-vertical-relative:text;
 mso-width-percent:0;mso-height-percent:0;mso-width-relative:margin;
 mso-height-relative:margin;v-text-anchor:top' o:gfxdata="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
AQAAWw4AAAAA
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    get svc istio-ingressgateway -n istio-system<o:p></o:p></span></p>
    <p class=MsoNormal><o:p>&nbsp;</o:p></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Text Box: kubectl get svc istio-ingressgateway -n istio-system

](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image055.png)<!--\[endif]-->**5.3** Execute the following command to determine if your Kubernetes cluster is running in an environment that supports external load balancers:

 

<!--\[if gte vml 1]><v:shape
 id="Picture_x0020_27" o:spid="_x0000_i1033" type="#_x0000_t75" style='width:414pt;
 height:23.5pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image056.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image057.jpg)<!--\[endif]-->

If the EXTERNAL-IP value is set, your environment has an external load balancer; if not, then set the external load balancer first then follow further steps.

For this cluster we are using metallb.

**5.4** Download and install Kiali dashboard and Prometheus.

**Install Kiali:**

[Kiali](https://kiali.io/) is an observability console for Istio with service mesh configuration and validation capabilities. It helps you understand the structure and health of your service mesh by monitoring traffic.

<!--\[if gte vml 1]><v:shape id="Text_x0020_Box_x0020_52"
 o:spid="_x0000_s1037" type="#_x0000_t202" style='position:absolute;
 margin-left:364.5pt;margin-top:1.7pt;width:415.7pt;height:37.45pt;z-index:251678725;
 visibility:visible;mso-wrap-style:square;mso-width-percent:0;
 mso-height-percent:0;mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;
 mso-wrap-distance-right:9pt;mso-wrap-distance-bottom:0;
 mso-position-horizontal:right;mso-position-horizontal-relative:margin;
 mso-position-vertical:absolute;mso-position-vertical-relative:text;
 mso-width-percent:0;mso-height-percent:0;mso-width-relative:margin;
 mso-height-relative:margin;v-text-anchor:top' o:gfxdata="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
TgoqECxMMWAjFyS5ba+vNi84QeFPNLhEglUCNXIoJd1rTWZAD6RiwsAvXcweCre51wnMCD3qdVXd
6PxbQ7ZnmmJnG5l3di3Ffkm8+W/t2HXO4EM0s8dQLqzQhX0hC0LusTRSqePkWGvFXqW+bKP+TxsD
A+XJhfHHyhcdcXQZPlTvyjC/zYTZxFAYRZnotSOO+1Q5OATCVa3qW03g04SkwVo+hx4dTE4twCwn
0OdoOb/HQ8Ec4JtQn12v/QQAAP//AwBQSwECLQAUAAYACAAAACEAu+VIlAUBAAAeAgAAEwAAAAAA
AAAAAAAAAAAAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQItABQABgAIAAAAIQCtMD/xwQAAADIB
AAALAAAAAAAAAAAAAAAAADYBAABfcmVscy8ucmVsc1BLAQItABQABgAIAAAAIQAGQFUF+QMAAGgL
AAAfAAAAAAAAAAAAAAAAACACAABjbGlwYm9hcmQvZHJhd2luZ3MvZHJhd2luZzEueG1sUEsBAi0A
FAAGAAgAAAAhAJJ9h+AdBwAASSAAABoAAAAAAAAAAAAAAAAAVgYAAGNsaXBib2FyZC90aGVtZS90
aGVtZTEueG1sUEsBAi0AFAAGAAgAAAAhAEnSBTsPAQAABgIAACoAAAAAAAAAAAAAAAAAqw0AAGNs
aXBib2FyZC9kcmF3aW5ncy9fcmVscy9kcmF3aW5nMS54bWwucmVsc1BLBQYAAAAABQAFAGcBAAAC
DwAAAAA=
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    apply -f </span><a
    href="https://raw.githubusercontent.com/istio/istio/release-1.17/samples/addons/kiali.yaml"><span
    style='color:#8EAADB;mso-themecolor:accent1;mso-themetint:153'>https://raw.githubusercontent.com/istio/istio/release-1.17/samples/addons/kiali.yaml</span></a><o:p></o:p></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                                                                                    |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                                                                                    |
|     | ![Text Box: kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.17/samples/addons/kiali.yaml](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image058.png) |

<!--\[endif]-->

 





**Install Prometheus:**

[Prometheus](https://prometheus.io/) is an open-source monitoring system and time series database. You can use Prometheus with Istio to record metrics that track the health of Istio and of applications within the service mesh.

<!--\[if gte vml 1]><v:shape id="Text_x0020_Box_x0020_55"
 o:spid="_x0000_s1036" type="#_x0000_t202" style='position:absolute;
 margin-left:364.5pt;margin-top:13.4pt;width:415.7pt;height:37.45pt;z-index:251679749;
 visibility:visible;mso-wrap-style:square;mso-width-percent:0;
 mso-height-percent:0;mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;
 mso-wrap-distance-right:9pt;mso-wrap-distance-bottom:0;
 mso-position-horizontal:right;mso-position-horizontal-relative:margin;
 mso-position-vertical:absolute;mso-position-vertical-relative:text;
 mso-width-percent:0;mso-height-percent:0;mso-width-relative:margin;
 mso-height-relative:margin;v-text-anchor:top' o:gfxdata="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
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    apply -f </span><a
    href="https://raw.githubusercontent.com/istio/istio/release-1.17/samples/addons/prometheus.yaml"><span
    style='color:#8EAADB;mso-themecolor:accent1;mso-themetint:153'>https://raw.githubusercontent.com/istio/istio/release-1.17/samples/addons/prometheus.yaml</span></a><o:p></o:p></p>
    <p class=MsoNormal><o:p>&nbsp;</o:p></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                                                                                             |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                                                                                             |
|     | ![Text Box: kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.17/samples/addons/prometheus.yaml

](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image059.png) |

<!--\[endif]-->

 





**5.5** Later after setting up ingress gateway and bookinfo gateway, we will view the dashboard, so for that you need to make these setting changes in your system proxy status.

[](<>)[Go to **Settings** > **Network** > **Proxy status** > Turn **Use a proxy server** On. In the exceptions field add your external IP address of kiali and ingressgateway service.](<>)<!--\[if !supportAnnotations]-->[\[GM3]](#_msocom_3)<!--\[endif]--> <!--\[if !supportAnnotations]-->[\[CN4]](#_msocom_4)<!--\[endif]--> 

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_63" o:spid="_x0000_s1035" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:362.65pt;
 margin-top:32.35pt;width:413.85pt;height:22.45pt;z-index:251686917;
 visibility:visible;mso-wrap-style:square;mso-width-percent:0;
 mso-height-percent:0;mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;
 mso-wrap-distance-right:9pt;mso-wrap-distance-bottom:0;
 mso-position-horizontal:right;mso-position-horizontal-relative:margin;
 mso-position-vertical:absolute;mso-position-vertical-relative:text;
 mso-width-percent:0;mso-height-percent:0;mso-width-relative:margin;
 mso-height-relative:margin;v-text-anchor:top' o:gfxdata="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
ZWxzUEsFBgAAAAAFAAUAZwEAADIOAAAAAA==
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    get svc -n istio-system<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Text Box: kubectl get svc -n istio-system](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image060.png)<!--\[endif]-->You can get IPs of these services by following command:

 

<!--\[if gte vml 1]><v:shape id="Picture_x0020_64"
 o:spid="_x0000_i1032" type="#_x0000_t75" style='width:414pt;height:51.5pt;
 visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image061.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image062.jpg)<!--\[endif]-->

<!--\[if gte vml 1]><v:shape id="Picture_x0020_28"
 o:spid="_x0000_i1031" type="#_x0000_t75" style='width:259pt;height:165pt;
 visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image063.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image064.jpg)<!--\[endif]-->

**Format:** http://{external ip};

**Note:** Your kiali service might be of ClusterIP type, so to get the external IP for this service, you first need to edit the service type to LoadBalancer.

\- Use the following command to edit the service, then edit the service type.

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_65" o:spid="_x0000_s1034" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:36.3pt;
 margin-top:.4pt;width:413.1pt;height:22.05pt;z-index:251687941;visibility:visible;
 mso-wrap-style:square;mso-width-percent:0;mso-height-percent:0;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-height-percent:0;
 mso-width-relative:margin;mso-height-relative:margin;v-text-anchor:top'
 o:gfxdata="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
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>kubectl
    edit svc kiali -n istio-system<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                     |
| --- | ----------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                     |
|     | ![Text Box: kubectl edit svc kiali -n istio-system](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image065.png) |

<!--\[endif]-->

 

Edit the service type {spec: {type:LoadBalancer}} as shown below:

      <!--\[if gte vml 1]><v:shape
 id="Picture_x0020_66" o:spid="_x0000_i1030" type="#_x0000_t75" style='width:322pt;
 height:69pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image066.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image067.jpg)<!--\[endif]-->           

<!--\[if gte vml 1]><v:shape id="Text_x0020_Box_x0020_57"
 o:spid="_x0000_s1033" type="#_x0000_t202" style='position:absolute;
 margin-left:363.25pt;margin-top:33.4pt;width:414.45pt;height:22.45pt;
 z-index:251680773;visibility:visible;mso-wrap-style:square;
 mso-width-percent:0;mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;
 mso-wrap-distance-right:9pt;mso-wrap-distance-bottom:0;
 mso-position-horizontal:right;mso-position-horizontal-relative:margin;
 mso-position-vertical:absolute;mso-position-vertical-relative:text;
 mso-width-percent:0;mso-width-relative:margin;v-text-anchor:top' o:gfxdata="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
AQAAWw4AAAAA
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>export
    INGRESS_NAME=istio-ingressgateway<o:p></o:p></span></p>
    <p class=MsoNormal><o:p>&nbsp;</o:p></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Text Box: export INGRESS_NAME=istio-ingressgateway

](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image068.png)<!--\[endif]-->**5.6** Set the ingress IP and ports:

 

<!--\[if gte vml 1]><v:shape
 id="Text_x0020_Box_x0020_58" o:spid="_x0000_s1032" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:363.25pt;
 margin-top:3pt;width:414.45pt;height:22.05pt;z-index:251681797;visibility:visible;
 mso-wrap-style:square;mso-width-percent:0;mso-height-percent:0;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:right;
 mso-position-horizontal-relative:margin;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-height-percent:0;
 mso-width-relative:margin;mso-height-relative:margin;v-text-anchor:top'
 o:gfxdata="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
AAAA
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>export
    INGRESS_NS=istio-system<o:p></o:p></span></p>
    <p class=MsoNormal><o:p>&nbsp;</o:p></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><v:shape id="Text_x0020_Box_x0020_60" o:spid="_x0000_s1030" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:363.65pt;
 margin-top:91.8pt;width:412.6pt;height:38.3pt;z-index:251683845;visibility:visible;
 mso-wrap-style:square;mso-width-percent:0;mso-height-percent:0;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:right;
 mso-position-horizontal-relative:margin;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-height-percent:0;
 mso-width-relative:margin;mso-height-relative:margin;v-text-anchor:top'
 o:gfxdata="UEsDBBQABgAIAAAAIQC75UiUBQEAAB4CAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbKSRvU7DMBSF
dyTewfKKEqcMCKEmHfgZgaE8wMW+SSwc27JvS/v23KTJgkoXFsu+P+c7Ol5vDoMTe0zZBl/LVVlJ
gV4HY31Xy4/tS3EvRSbwBlzwWMsjZrlprq/W22PELHjb51r2RPFBqax7HCCXIaLnThvSAMTP1KkI
+gs6VLdVdad08ISeCho1ZLN+whZ2jsTzgcsnJwldluLxNDiyagkxOquB2Knae/OLUsyEkjenmdzb
mG/YhlRnCWPnb8C898bRJGtQvEOiVxjYhtLOxs8AySiT4JuDystlVV4WPeM6tK3VaILeDZxIOSsu
ti/jidNGNZ3/J08yC1dNv9v8AAAA//8DAFBLAwQUAAYACAAAACEArTA/8cEAAAAyAQAACwAAAF9y
ZWxzLy5yZWxzhI/NCsIwEITvgu8Q9m7TehCRpr2I4FX0AdZk2wbbJGTj39ubi6AgeJtl2G9m6vYx
jeJGka13CqqiBEFOe2Ndr+B03C3WIDihMzh6RwqexNA281l9oBFTfuLBBhaZ4ljBkFLYSMl6oAm5
8IFcdjofJ0z5jL0MqC/Yk1yW5UrGTwY0X0yxNwri3lQgjs+Qk/+zfddZTVuvrxO59CNCmoj3vCwj
MfaUFOjRhrPHaN4Wv0VV5OYgm1p+LW1eAAAA//8DAFBLAwQUAAYACAAAACEArGqNEuMDAACJCwAA
HwAAAGNsaXBib2FyZC9kcmF3aW5ncy9kcmF3aW5nMS54bWzsVttu4zYQfS/QfyCIBXb3IbZ89xqr
pI4bBwtkHcNysQ9FUdAUZamhSJWkHXmL/ku/pV/WGUq+Jdst0MtDgU0AmeSMjg7PnKH09qrMJdkK
YzOtQtpqBJQIxXWcqXVIv1tOL4aUWMdUzKRWIqQ7YenV5ddfvWWjtWFFmnECCMqOWEhT54pRs2l5
KnJmG7oQCmKJNjlzMDXrZmzYIyDnstkOgn4zZ5mil0eob5ljZGOyvwElNX8Q8YSpLbMAKfnodKXm
KPk/R2Yjtb01RVTMDTLns+3ckCwOKSinWA4S0WYdqNNg2nxy1/oIUCYmx3ydJKSECnSGw1YLsHYh
7Xa6g2G3V+GJ0hEOCb12501n2KOEY8awNxjUCTy9/wsInt58HgRoVnRgcELRFkhQbZ/vuX/Y9BL5
XeuSwNJ+/5hPXAmrsC9c9TLsUWyt4L8kwIE7GxXGuluhc4KDkBrBnXcZ295ZV9HYp+DGrJZZPM2k
9BM0r5hIQ7ZMhtSVLX+r3OTvdVyt9XtBUG8SllF0n9rZLwMT3wKI4vd89gCpyGNI+5Dtgc9iyOrw
6JVk/KFW7SQL0KWqYGsBXRn5AqHS8Q43sYJfkN5o2D1UyBZ8mgH0HbNuzgx0KixCz7t7uCRSAx8u
s4KSVJuPT9cwD7oGIpQ8QseH1P68YUZQIt8pG9I3rW4X4JyfdHuDNkzMaWR1GlGbfKJB15Zn5YeY
7+R+mBidf9AmHuNTIcQUh2dDIfbDiYMZBOBY4WI89mOu84K5OxUV0OBVwVDKZfmBmaJ2gQODznSU
skJ8ygxVrve5Hm+cTrLaKZWWGJDWRW4nhbe3Vxz9nTNz50nAYIEDn4pUcADSz7mrDNIKBrVxfA2P
Gdci2ec6W+V6f6GRCn6MjhP3NG9YObHK9HEY1r4A87GRAYqS4WEu1MXtNcj+ESRqwW0e6sz6Zr06
uG/q/57bj41EkkBDVZ0EojCXKeJ2hUgYh8NvwmS2MhklBVPawkLQDqZBD6743w06eIVo5ng6ZXkm
4RTrwAJPmbHC19zrK9h/AMrtCegyy4UlM/FIFjpn6oxxO+gD0x7wReadZ4xb8FY8Zwyyg9SoqbsU
ZaGNI+9mt4ubKPpxfr9Yhi9ePWxWoJskF4rQF/vYLKJkLRyxwmwzLk4j4/c3lFxo8pPVCtydhi9/
adhC8AaC2++vXn3T8O+b6pXWpq9/8JFfX77GcxacgpSQkFAxdv3is074UlVoi09V9aieV7Tqe5T1
f9/8X0r+JyU/NPLvv521Eh6t3gTHN+3GiqhYQF9XnxXVqxjy8JOp+eQj1N9afzTjl+7p/PIPAAAA
//8DAFBLAwQUAAYACAAAACEAkn2H4B0HAABJIAAAGgAAAGNsaXBib2FyZC90aGVtZS90aGVtZTEu
eG1s7FlLbxs3EL4X6H9Y7L2xZL1iI3JgyXLcxC9ESoocKYnaZcxdLkjKjm5FcuqlQIG06KEBeuuh
KBqgARr00h9jwEGb/ogOuS9SouIHXCAobAHG7uw3w+HM7Mzs8M7dZxH1jjEXhMVtv3qr4ns4HrEx
iYO2/2iw/dlt3xMSxWNEWYzb/gwL/+7Gp5/cQesjSpIhQ3w8CHGEPRAUi3XU9kMpk/WVFTECMhK3
WIJjeDZhPEISbnmwMuboBBaI6MpqpdJciRCJ/Q2QKJWgHoV/sRSKMKK8r8RgL0YRrH4wmZAR1tjx
UVUhxEx0KfeOEW37IHPMTgb4mfQ9ioSEB22/ov/8lY07K2g9Y6JyCa/Bt63/Mr6MYXy0qtfkwbBY
tF5v1JubhXwNoHIR12v1mr1mIU8D0GgEO011sWW2Vrv1DGuA0kuH7K3WVq1q4Q35tQWdNxvqZ+E1
KJVfX8Bvb3fBihZeg1J8YwHf6Kx1tmz5GpTimwv4VmVzq96y5GtQSEl8tICuNJq1br7bAjJhdMcJ
X2vUt1urmfASBdFQRJdaYsJiuSzWIvSU8W0AKCBFksSenCV4gkYQk11EyZATb5cEIQRegmImgFxZ
rWxXavBf/er6SnsUrWNkcCu9QBOxQFL6eGLESSLb/n2Q6huQs7dvT5+/OX3+++mLF6fPf83W1qIs
vh0UBybf+5+++efVl97fv/34/uW36dLzeGHi3/3y1bs//vyQeNhxaYqz716/e/P67Puv//r5pUP6
JkdDEz4gERbePj7xHrIINujQHw/55TgGISImx2YcCBQjtYpDfk+GFnp/hihy4DrYtuNjDqnGBbw3
fWop3A/5VBKHxAdhZAH3GKMdxp1WeKDWMsw8mMaBe3E+NXEPETp2rd1FseXl3jSBHEtcIrshttQ8
pCiWKMAxlp56xo4wduzuCSGWXffIiDPBJtJ7QrwOIk6TDMjQiqaSaYdE4JeZS0Hwt2Wbvcdeh1HX
rrfwsY2EdwNRh/IDTC0z3kNTiSKXyAGKqGnwXSRDl5L9GR+ZuJ6Q4OkAU+b1xlgIF88Bh/0aTn8A
acbt9j06i2wkl+TIJXMXMWYit9hRN0RR4sL2SRya2M/FEYQo8g6ZdMH3mP2GqHvwA4qXuvsxwZa7
z88GjyDDmiqVAaKeTLnDl/cws+K3P6MThF2pZpNHVord5MQZHZ1pYIX2LsYUnaAxxt6jzx0adFhi
2bxU+n4IWWUHuwLrPrJjVd3HWGBPNzeLeXKXCCtk+zhgS/TZm80lnhmKI8SXSd4Hr5s270Gpi1wB
cEBHRyZwn0C/B/HiNMqBABlGcC+Vehgiq4Cpe+GO1xm3/HeRdwzey6eWGhd4L4EHX5oHErvJ80Hb
DBC1FigDZoCgy3ClW2Cx3F+yqOKq2aZOvon90pZugO7IanoiEp/bAc31Po3/rveBDuPsh1eOl+16
+h23YCtZXbLTWZZMdub6m2W4+a6my/iYfPxNzRaaxocY6shixrrpaW56Gv9/39Mse59vOpll/cZN
J+NDh3HTyWTDlevpZMrmBfoaNfBIBz167BMtnfpMCKV9OaN4V+jBj4DvmfE2EBWfnm7iYgqYhHCp
yhwsYOECjjSPx5n8gsiwH6IEpkNVXwkJRCY6EF7CBAyNNNkpW+HpNNpj43TYWa2qwWZaWQWSJb3S
KOgwqJIputkqB3iFeK1toAetuQKK9zJKGIvZStQcSrRyojKSHuuC0RxK6J1dixZrDi1uK/G5qxa0
ANUKr8AHtwef6W2/UQcWYIJ5HDTnY+Wn1NW5d7Uzr9PTy4xpRQA02HkElJ5eU7ou3Z7aXRpqF/C0
pYQRbrYS2jK6wRMhfAZn0amoF1Hjsr5eK11qqadModeD0CrVaN3+kBZX9TXwzecGGpuZgsbeSdtv
1hoQMiOUtP0JDI3hMkogdoT65kI0gOOWkeTpC3+VzJJwIbeQCFOD66STZoOISMw9SqK2r7ZfuIHG
Oodo3aqrkBA+WuXWIK18bMqB020n48kEj6TpdoOiLJ3eQoZPc4XzqWa/Olhxsim4ux+OT7whnfKH
CEKs0aoqA46JgLODamrNMYHDsCKRlfE3V5iytGueRukYSumIJiHKKoqZzFO4TuWFOvqusIFxl+0Z
DGqYJCuEw0AVWNOoVjUtqkaqw9Kqez6TspyRNMuaaWUVVTXdWcxaIS8Dc7a8WpE3tMpNDDnNrPBp
6p5PuWt5rpvrE4oqAQYv7OeouhcoCIZq5WKWakrjxTSscnZGtWtHvsFzVLtIkTCyfjMXO2e3okY4
lwPilSo/8M1HLZAmeV+pLe062N5DiTcMqm0fDpdhOPgMruB42gfaqqKtKhpcwZkzlIv0oLjtZxc5
BZ6nlAJTyym1HFPPKfWc0sgpjZzSzClN39MnqnCKrw5TfS8/MIUalh2wZr2Fffq/8S8AAAD//wMA
UEsDBBQABgAIAAAAIQCcZkZBuwAAACQBAAAqAAAAY2xpcGJvYXJkL2RyYXdpbmdzL19yZWxzL2Ry
YXdpbmcxLnhtbC5yZWxzhI/NCsIwEITvgu8Q9m7SehCRJr2I0KvUBwjJNi02PyRR7Nsb6EVB8LIw
s+w3s037sjN5YkyTdxxqWgFBp7yenOFw6y+7I5CUpdNy9g45LJigFdtNc8VZ5nKUxikkUigucRhz
DifGkhrRykR9QFc2g49W5iKjYUGquzTI9lV1YPGTAeKLSTrNIXa6BtIvoST/Z/thmBSevXpYdPlH
BMulFxagjAYzB0pXZ501LV2BiYZ9/SbeAAAA//8DAFBLAQItABQABgAIAAAAIQC75UiUBQEAAB4C
AAATAAAAAAAAAAAAAAAAAAAAAABbQ29udGVudF9UeXBlc10ueG1sUEsBAi0AFAAGAAgAAAAhAK0w
P/HBAAAAMgEAAAsAAAAAAAAAAAAAAAAANgEAAF9yZWxzLy5yZWxzUEsBAi0AFAAGAAgAAAAhAKxq
jRLjAwAAiQsAAB8AAAAAAAAAAAAAAAAAIAIAAGNsaXBib2FyZC9kcmF3aW5ncy9kcmF3aW5nMS54
bWxQSwECLQAUAAYACAAAACEAkn2H4B0HAABJIAAAGgAAAAAAAAAAAAAAAABABgAAY2xpcGJvYXJk
L3RoZW1lL3RoZW1lMS54bWxQSwECLQAUAAYACAAAACEAnGZGQbsAAAAkAQAAKgAAAAAAAAAAAAAA
AACVDQAAY2xpcGJvYXJkL2RyYXdpbmdzL19yZWxzL2RyYXdpbmcxLnhtbC5yZWxzUEsFBgAAAAAF
AAUAZwEAAJgOAAAAAA==
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>export
    INGRESS_PORT=$(kubectl -n &quot;$INGRESS_NS&quot; get service
    &quot;$INGRESS_NAME&quot; -o
    jsonpath='{.spec.ports\[?(@.name==&quot;http2&quot;)].port}')<o:p></o:p></span></p>
    <p class=MsoNormal><o:p>&nbsp;</o:p></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><v:shape id="Text_x0020_Box_x0020_59" o:spid="_x0000_s1031" type="#_x0000_t202"
 style='position:absolute;left:0;text-align:left;margin-left:363.25pt;
 margin-top:42pt;width:414.45pt;height:36.2pt;z-index:251682821;visibility:visible;
 mso-wrap-style:square;mso-width-percent:0;mso-height-percent:0;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:right;
 mso-position-horizontal-relative:margin;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-height-percent:0;
 mso-width-relative:margin;mso-height-relative:margin;v-text-anchor:top'
 o:gfxdata="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
AAAABQAFAGcBAACcDgAAAAA=
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>export
    INGRESS_HOST=$(kubectl -n &quot;$INGRESS_NS&quot; get service
    &quot;$INGRESS_NAME&quot; -o
    jsonpath='{.status.loadBalancer.ingress\[0].ip}')<o:p></o:p></span></p>
    <p class=MsoNormal><o:p>&nbsp;</o:p></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                     |     |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
|     |                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                     |     |
|     | ![Text Box: export INGRESS_NS=istio-system

](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image069.png)                                                                                                   |                                                                                                                                                                                                                                     |     |
|     |                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                     |     |
|     | ![Text Box: export INGRESS_HOST=$(kubectl -n "$INGRESS_NS" get service "$INGRESS_NAME" -o jsonpath='{.status.loadBalancer.ingress\[0\].ip}')

](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image070.png) |                                                                                                                                                                                                                                     |     |
|     |                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                     |     |
|     |                                                                                                                                                                                                                                   | ![Text Box: export INGRESS_PORT=$(kubectl -n "$INGRESS_NS" get service "$INGRESS_NAME" -o jsonpath='{.spec.ports\[?(@.name=="http2")\].port}')

](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image071.png) |     |

<!--\[endif]-->

 

 

 

 



                            

 

<!--\[if gte vml 1]><v:shape id="Text_x0020_Box_x0020_61"
 o:spid="_x0000_s1029" type="#_x0000_t202" style='position:absolute;
 margin-left:363.25pt;margin-top:32.75pt;width:414.45pt;height:21.65pt;
 z-index:251684869;visibility:visible;mso-wrap-style:square;
 mso-width-percent:0;mso-height-percent:0;mso-wrap-distance-left:9pt;
 mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:right;
 mso-position-horizontal-relative:margin;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-height-percent:0;
 mso-width-relative:margin;mso-height-relative:margin;v-text-anchor:top'
 o:gfxdata="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
AAAABQAFAGcBAABjDgAAAAA=
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>export
    GATEWAY_URL=$INGRESS_HOST:$INGRESS_PORT<o:p></o:p></span></p>
    <p class=MsoNormal><o:p>&nbsp;</o:p></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Text Box: export GATEWAY_URL=$INGRESS_HOST:$INGRESS_PORT

](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image072.png)<!--\[endif]-->**5.7** Export andSet GATEWAY_URL:

 

<!--\[if gte vml 1]><v:shape id="Text_x0020_Box_x0020_62"
 o:spid="_x0000_s1028" type="#_x0000_t202" style='position:absolute;
 margin-left:363.85pt;margin-top:18.6pt;width:415.05pt;height:25.8pt;z-index:251685893;
 visibility:visible;mso-wrap-style:square;mso-width-percent:0;
 mso-height-percent:0;mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;
 mso-wrap-distance-right:9pt;mso-wrap-distance-bottom:0;
 mso-position-horizontal:right;mso-position-horizontal-relative:margin;
 mso-position-vertical:absolute;mso-position-vertical-relative:text;
 mso-width-percent:0;mso-height-percent:0;mso-width-relative:margin;
 mso-height-relative:margin;v-text-anchor:top' o:gfxdata="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
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>echo
    &quot;$GATEWAY_URL&quot;<o:p></o:p></span></p>
    <p class=MsoNormal><o:p>&nbsp;</o:p></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                      |
| --- | -------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                      |
|     | ![Text Box: echo "$GATEWAY_URL"

](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image073.png) |

<!--\[endif]-->



 



<!--\[if gte vml 1]><v:shape id="Picture_x0020_18"
 o:spid="_x0000_i1029" type="#_x0000_t75" style='width:414pt;height:26pt;
 visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image074.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image075.jpg)<!--\[endif]-->

              Curl into productpage using gateway URL using following command.

<!--\[if gte vml 1]><v:shape id="Text_x0020_Box_x0020_67"
 o:spid="_x0000_s1027" type="#_x0000_t202" style='position:absolute;
 margin-left:361.3pt;margin-top:1.4pt;width:412.5pt;height:22.45pt;z-index:251688965;
 visibility:visible;mso-wrap-style:square;mso-width-percent:0;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:right;
 mso-position-horizontal-relative:margin;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-width-relative:margin;
 v-text-anchor:top' o:gfxdata="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
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>curl
    -v<span style='mso-spacerun:yes'>  </span>http://$GATEWAY_URL/productpage<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
 <w:wrap anchorx="margin"/>
</v:shape><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                       |
|     | ![Text Box: curl -v  http://$GATEWAY_URL/productpage](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image076.png) |

<!--\[endif]-->

 

 



<!--\[if gte vml 1]><v:shape id="Picture_x0020_17"
 o:spid="_x0000_i1028" type="#_x0000_t75" style='width:451.5pt;height:102pt;
 visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image077.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image078.jpg)<!--\[endif]-->

You can generate traffic on product page by just reaching out to shown http URL.

**Note:** Before reaching out to this page and kiali in further step, ensure that you have followed

Step 5.5 properly.

 

**5.9** **Kiali Dashboard**

Generate traffic on product page and observe the graphs on Kiali dashboard.

<!--\[if gte vml 1]><v:shape id="Text_x0020_Box_x0020_68"
 o:spid="_x0000_s1026" type="#_x0000_t202" style='position:absolute;
 margin-left:-2.9pt;margin-top:52.2pt;width:436.6pt;height:23.3pt;z-index:251689989;
 visibility:visible;mso-wrap-style:square;mso-height-percent:0;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-height-percent:0;
 mso-height-relative:margin;v-text-anchor:top' o:gfxdata="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
" fillcolor="#5a5a5a \[2109]" strokeweight=".5pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span style='color:white;mso-themecolor:background1'>http://&lt;kiali_external_ip&gt;:&lt;port&gt;<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:shape><!\[endif]--><!--\[if !vml]-->![Text Box: http://\<kiali_external_ip>:\<port>](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image079.png)<!--\[endif]-->Reach out to kiali dashboard in your browser by just copying external IP from above and http into that IP and port.

 

After reaching kiali dashboard, generate traffic on product page and simultaneously, vview and analyse traffic on kiali using various graphs and visualising methods.

App Graph:

<!--\[if gte vml 1]><v:shape
 id="Picture_x0020_36" o:spid="_x0000_i1027" type="#_x0000_t75" style='width:403.5pt;
 height:128.5pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image080.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image081.jpg)<!--\[endif]-->

 

Service Graph:

<!--\[if gte vml 1]><v:shape
 id="Picture_x0020_34" o:spid="_x0000_i1026" type="#_x0000_t75" style='width:423.5pt;
 height:151.5pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image082.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image083.jpg)<!--\[endif]-->

The graph below shows services communication, and the lock here symbolises mTls protocol.

<!--\[if gte vml 1]><v:shape
 id="Picture_x0020_23" o:spid="_x0000_i1025" type="#_x0000_t75" style='width:385pt;
 height:186.5pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image084.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/chaturvn/AppData/Local/Temp/msohtmlclip1/01/clip_image085.jpg)<!--\[endif]--> 

 

We hope that this blog has helped you in integrating ISTIO and SPIRE from scratch, getting SPIRE issued identities for your sample application workloads, and setting up Kiali on your cluster for better visualisation of your service mesh.

 

 



 

 

 

 

 

  

<!--\[if !supportAnnotations]-->

- - -

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[GM1]](#_msoanchor_1)<!--\[endif]-->This sentence is not clear—did I add the commas in the correct places?

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[CN2]](#_msoanchor_2)<!--\[endif]-->I hope it’s more clear now !?

 

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[GM3]](#_msoanchor_3)<!--\[endif]-->Go to **Settings > Network > Proxy status**. Turn **Use a proxy server** On. In the exceptions field, add…

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[CN4]](#_msoanchor_4)<!--\[endif]-->Is it ok now?

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--EndFragment-->