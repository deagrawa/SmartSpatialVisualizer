package com.sap.pia.producer;

// import com.sap.pia.usagecloud.*;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;
import javax.naming.NamingException;
import org.odata4j.core.OEntity;
import org.odata4j.core.OEntityId;
import org.odata4j.core.OEntityKey;
import org.odata4j.core.OExtension;
import org.odata4j.core.OFunctionParameter;
import org.odata4j.edm.EdmDataServices;
import org.odata4j.edm.EdmFunctionImport;
import org.odata4j.producer.BaseResponse;
import org.odata4j.producer.CountResponse;
import org.odata4j.producer.EntitiesResponse;
import org.odata4j.producer.EntityIdResponse;
import org.odata4j.producer.EntityQueryInfo;
import org.odata4j.producer.EntityResponse;
import org.odata4j.producer.ODataProducer;
import org.odata4j.producer.QueryInfo;
import org.odata4j.producer.Responses;
import org.odata4j.producer.edm.MetadataProducer;
// import org.odata4j.producer.exceptions.NotImplementedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JdbcDataProducer implements ODataProducer
{

	/**
	 * Static constant Logger object used for adding various logs .
	 */
	private static final Logger LOGGER= LoggerFactory.getLogger(JdbcDataProducer.class);

	private EdmDataServices metadata;
	/** jdbc connection */
	private Connection connection;
	/** jdbc operation assistant */

	GetMetaData getMetaData;

	public JdbcDataProducer() throws NamingException, ClassNotFoundException, SQLException
	{

		getMetaData= new GetMetaData();
		metadata= getMetaData.odataMetaData();
	}

	/**
	 * getMetadata method used to get metadata of a database schema.
	 * 
	 * @return
	 *			  Return metadata in the form of EdmDataServices.
	 */
	@Override
	public EdmDataServices getMetadata()
	{
		return this.metadata;
	}

	/**
	 * getEntities method used to select all data for a given table with condition clause.
	 * 
	 * @param entitySetName
	 *            Table name
	 * @param queryInfo
	 *            Condition clause
	 * @return
	 *			  Return response in entity of properties.
	 */
	@Override
	public EntitiesResponse getEntities(String entitySetName, QueryInfo queryInfo)
	{
		GetData getData;
		EntitiesResponse entitiesResponse= null;
		try
		{
			getData= new GetData(metadata);
			entitiesResponse= getData.getAllData(entitySetName, queryInfo);
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		return entitiesResponse;
	}

	@Override
	public EntitiesResponse getNavProperty(String entitySetName, OEntityKey entityKey, String navProp, QueryInfo queryInfo)
	{
		return null;
	}

	/**
	 * close method used to close Database connection.
	 * 
	 */
	@Override
	public void close()
	{
		try
		{
			connection.close();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}

	/**
	 * createEntity method used to add new row into database table.
	 * 
	 * @param entitySetName
	 *            Table name
	 * @param entity
	 *            Table columns and values
	 * @return
	 *			  Return success and failure response.
	 */
	@Override
	public EntityResponse createEntity(String entitySetName, OEntity entity)
	{
		InsertData insertData= null;
		OEntity nEntity= null;
		try
		{
			insertData= new InsertData(metadata);
			return(insertData.addData(entitySetName, entity));
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}

		return Responses.entity(nEntity);
	}

	/**
	 * createEntity method used to add new row into database table.
	 * 
	 * @param entitySetName
	 *            Table name
	 * @param entity
	 *            Table columns and values
	 * @param entityKey
	 *            Object entity key
	 * @param navProp
	 *            nav properties values
	 * @return
	 *			  Return success and failure response.
	 */
	@Override
	public EntityResponse createEntity(String entitySetName, OEntityKey entityKey, String navProp, OEntity entity)
	{
		return createEntity(entitySetName, entity);
	}

	/**
	 * deleteEntity method used to delete a row for a given table with condition clause.
	 * 
	 * @param entitySetName
	 *            Table name
	 * @param entityKey
	 *            Constraint name and value
	 * @return
	 *			  
	 */
	@Override
	public void deleteEntity(String entitySetName, OEntityKey entityKey)
	{

		UpdateData updateData= null;
		try
		{
			updateData= new UpdateData(metadata);
			updateData.deleteRow(entitySetName, entityKey);
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
	}

	/**
	 * mergeEntity method used to update a row for a given table with condition clause.
	 * 
	 * @param entitySetName
	 *            Table name
	 * @param entity
	 *            Table columns and new values
	 * @return
	 *			  
	 */
	@Override
	public void mergeEntity(String entitySetName, OEntity entity)
	{
		UpdateData updateData= null;
		try
		{
			updateData= new UpdateData(metadata);
			updateData.updateRow(entitySetName, entity);
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
	}

	/**
	 * mergeEntity method used to update a row for a given table with condition clause.
	 * 
	 * @param entitySetName
	 *            Table name
	 * @param entity
	 *            Table columns and new values
	 * @return
	 *			  
	 */
	@Override
	public void updateEntity(String entitySetName, OEntity entity)
	{
		mergeEntity(entitySetName, entity);
	}

	public <TExtension extends OExtension<ODataProducer>> TExtension findExtension(Class<TExtension> clazz)
	{
		return null;
	}

	@Override
	public EntityIdResponse getLinks(OEntityId sourceEntity, String targetNavProp)
	{
		return null;
		// throw new NotImplementedException();
	}

	@Override
	public BaseResponse callFunction(EdmFunctionImport arg0, Map<String, OFunctionParameter> arg1, QueryInfo arg2)
	{
		return null;
	}

	@Override
	public void createLink(OEntityId arg0, String arg1, OEntityId arg2)
	{

	}

	@Override
	public void deleteLink(OEntityId arg0, String arg1, OEntityKey arg2)
	{

	}

	/**
	 * getEntitiesCount method used to get row count for a given table with condition clause.
	 * 
	 * @param entitySetName
	 *            Table name
	 * @param queryInfo
	 *            Condition clause
	 * @return
	 *			  Return total number of rows.
	 */
	@Override
	public CountResponse getEntitiesCount(String entitySetName, QueryInfo queryInfo)
	{
		GetData getData;
		long count= 0;
		try
		{
			getData= new GetData(metadata);
			count= getData.getRowCount(entitySetName, queryInfo);
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		return Responses.count(count);
	}

	/**
	 * getEntity method used to get data for a given data with primary key constraint.
	 * 
	 * @param entitySetName
	 *            Table name
	 * @param queryInfo
	 *            Condition clause
	 * @return
	 *			  Return response in entity of property.
	 */
	@Override
	public EntityResponse getEntity(String arg0, OEntityKey arg1, EntityQueryInfo arg2)
	{
		GetData getData= null;
		EntityResponse entityResponse= null;
		try
		{
			getData= new GetData(metadata);
			entityResponse= getData.getEntity(arg0, arg1);
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		return entityResponse;
	}

	@Override
	public MetadataProducer getMetadataProducer()
	{
		return new MetadataProducer(this, null);
	}

	@Override
	public CountResponse getNavPropertyCount(String arg0, OEntityKey arg1, String arg2, QueryInfo arg3)
	{
		return null;
	}

	@Override
	public void updateLink(OEntityId arg0, String arg1, OEntityKey arg2, OEntityId arg3)
	{

	}

}
